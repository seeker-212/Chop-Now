import mongoose from "mongoose";
import DeliveryAssignment from "../model/deliveryAssignmentModel.js";
import Order from "../model/orderModel.js";
import Shop from "../model/shopModel.js";
import User from "../model/userModel.js";

//MAKE AN ORDER CONTROLLER
export const placeOrder = async (req, res) => {
  try {
    const { cartItems, paymentMethod, deliveryAddress, totalAmount } = req.body;
    if (cartItems.length === 0 || !cartItems) {
      return res.status(400).json({ message: "cart is empty" });
    }
    if (
      !deliveryAddress.text ||
      !deliveryAddress.latitude ||
      !deliveryAddress.longitude
    ) {
      return res.status(400).json({ message: "Delivery Address no available" });
    }

    const groupItemByShop = {};

    cartItems.forEach((item) => {
      const shopId = item.shop;
      if (!groupItemByShop[shopId]) {
        groupItemByShop[shopId] = [];
      }
      groupItemByShop[shopId].push(item);
    });

    const shopOrders = await Promise.all(
      Object.keys(groupItemByShop).map(async (shopId) => {
        const shop = await Shop.findById(shopId).populate("owner");
        if (!shop) {
          return res.status(400).json({ message: "Shop not found" });
        }
        const items = groupItemByShop[shopId];
        const subtotal = items.reduce(
          (sum, i) => sum + Number(i.price) * Number(i.quantity),
          0
        );

        return {
          shop: shop._id,
          owner: shop.owner._id,
          subtotal,
          shopOrderItem: items.map((i) => ({
            item: i.id,
            price: i.price,
            quantity: i.quantity,
            name: i.name,
          })),
        };
      })
    );

    const newOrder = await Order.create({
      user: req.userId,
      paymentMethod,
      deliveryAddress,
      totalAmount,
      shopOrders,
    });

    await newOrder.populate(
      "shopOrders.shopOrderItem.item",
      "name image price"
    );
    await newOrder.populate("shopOrders.shop", "name");

    return res.status(201).json(newOrder);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: `Error placing order ${error}` });
  }
};

//GET USER & OWNER ORDERS
export const getMyOrders = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (user.role === "user") {
      const orders = await Order.find({ user: req.userId })
        .sort({ createdAt: -1 })
        .populate("shopOrders.shop", "name")
        .populate("shopOrders.owner", "name email mobile")
        .populate("shopOrders.shopOrderItem.item", "name image price");

      return res.status(200).json(orders);
    } else if (user.role === "owner") {
      const orders = await Order.find({ "shopOrders.owner": req.userId })
        .sort({ createdAt: -1 })
        .populate("shopOrders.shop", "name")
        .populate("user")
        .populate("shopOrders.shopOrderItem.item", "name image price");

      const filteredOrders = orders.map((order) => ({
        _id: order._id,
        paymentMethod: order.paymentMethod,
        user: order.user,
        shopOrders:
          order.shopOrders?.filter(
            (o) => o.owner?._id?.toString() === req.userId.toString()
          ) || [],
        createdAt: order.createdAt,
        deliveryAddress: order.deliveryAddress,
      }));

      return res.status(200).json(filteredOrders);
    } else {
      return res.status(403).json({ message: "Unauthorized role" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: `Error Getting User order ${error}` });
  }
};

//Order Status Controller
export const updateOrderStatus = async (req, res) => {
  console.log("🔥 updateOrderStatus hit");
  try {
    const { orderId, shopId } = req.params;
    const { status } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const shopOrder = order.shopOrders.find(
      (o) => o.shop?._id?.toString() === shopId || o.shop?.toString() === shopId
    );

    if (!shopOrder) {
      return res.status(400).json({ message: "shop Order not found" });
    }

    shopOrder.status = status;
    let deliveryBoyPayLoad = [];
    if (status === "out for delivery" || !shopOrder.assignment) {
      const { longitude, latitude } = order.deliveryAddress;
      const nearByDeliveryBoys = await User.find({
        role: "ChopNowRider",
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [Number(longitude), Number(latitude)],
            },
            $maxDistance: 50000,
          },
        },
      });

      const nearByIds = nearByDeliveryBoys.map((b) => b._id);
      const busyIds = await DeliveryAssignment.find({
        assignedTo: { $in: nearByIds },
        status: { $nin: ["broadcasted", "completed"] },
      }).distinct("assignedTo");

      const busyIdSet = new Set(busyIds.map((id) => String(id)));
      const availableBoys = nearByDeliveryBoys.filter(
        (b) => !busyIdSet.has(b._id)
      );
      const candidates = availableBoys.map((b) => b._id);

      if (candidates.length === 0) {
        await order.save();
        return res.json({
          message: "Order status is updated but there is no available rider",
        });
      }

      const deliveryAssignment = await DeliveryAssignment.create({
        order: order._id,
        shop: shopOrder.shop,
        shopOrderId: shopOrder._id,
        broadcastedTo: candidates,
        status: "broadcasted",
      });
      shopOrder.assignedDeliveryBoy = deliveryAssignment.assignedTo;
      shopOrder.assignment = deliveryAssignment._id;
      deliveryBoyPayLoad = availableBoys.map((b) => ({
        id: b._id,
        fullName: b.fullName,
        longitude: b.location.coordinates?.[0],
        latitude: b.location.coordinates?.[1],
        mobile: b.mobile,
      }));
    }

    await shopOrder.save();
    await order.save();

    const updatedShopOrder = order.shopOrders.find(
      (o) => o.shop?._id?.toString() === shopId || o.shop?.toString() === shopId
    );

    await order.populate("shopOrders.shop", "name");
    await order.populate(
      "shopOrders.assignedDeliveryBoy",
      "fullName email mobile"
    );
    return res.status(200).json({
      shopOrder: updatedShopOrder,
      assignedDeliveryBoy: updatedShopOrder?.assignedDeliveryBoy,
      availableBoys: deliveryBoyPayLoad,
      assignment: updatedShopOrder?.assignment._id,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: `Order Status error ${error}` });
  }
};

//Delivery Assignment Controller
export const getDeliveryAssignment = async (req, res) => {
  try {
    const deliveryBoyId = new mongoose.Types.ObjectId(req.userId);
    const assignment = await DeliveryAssignment.find({
      broadcastedTo: deliveryBoyId,
      status: "broadcasted",
    })
      .populate("order")
      .populate("shop");

    const formatted = assignment.map((a) => {
      const shopOrder = a.order.shopOrders.find((s) =>
        s._id.equals(a.shopOrderId)
      );
      return {
        assignment: a._id,
        orderId: a.order._id,
        shopName: a.shop.name,
        deliveryAddress: a.order.deliveryAddress,
        items: shopOrder?.shopOrderItem || [],
        subtotal: shopOrder?.subtotal || 0,
      };
    });


    return res.status(200).json(formatted);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: `Assigning Delivery Error ${error}` });
  }
};
