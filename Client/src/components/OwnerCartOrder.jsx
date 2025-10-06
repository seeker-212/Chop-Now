import axios from "axios";
import React from "react";
import { MdPhone } from "react-icons/md";
import { serverUrl } from "../App";
import { updateOrderStatus } from "../redux/userSlice";
import { useDispatch } from "react-redux";

const OwnerCartOrder = ({ data }) => {
  const dispatch = useDispatch();

  const handleUpdateStatus = async (orderId, shopId, status) => {
    try {
      const result = await axios.post(
        `${serverUrl}/api/order/update-status/${orderId}/${shopId}`,
        { status },
        { withCredentials: true }
      );
      dispatch(updateOrderStatus({ orderId, shopId, status }));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg space-y-4 p-4">
      <div>
        <h2 className="text-lg font-semibold text-gray-800">
          {data.user.fullName}
        </h2>
        <p className="text-sm text-gray-500">{data.user.email}</p>
        <p className="flex items-center gap-2 text-sm text-gray-600 mt-1">
          <MdPhone />
          <span>{data.user.mobile}</span>
        </p>
      </div>

      <div className="flex items-start flex-col gap-2 text-gray-600 text-sm">
        <p>{data?.deliveryAddress.text}</p>
        <p className="text-xs text-gray-500">
          lat: {data?.deliveryAddress.latitude}, lon:{" "}
          {data?.deliveryAddress.longitude}
        </p>
      </div>

      <div className="flex space-x-4 overflow-x-auto pb-2">
        {data.shopOrders?.map((shopOrder, index) => (
          <div key={index} className="flex space-x-4 overflow-x-auto pb-2">
            {shopOrder.shopOrderItem?.map((item, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-40 border border-gray-400 rounded-lg p-2 bg-white"
              >
                <img
                  src={item.item.image}
                  alt=""
                  className="w-full h-24 object-cover rounded"
                />
                <p className="text-sm font-semibold mt-1">{item.name}</p>
                <p className="text-xs text-gray-500">
                  ₦{item.price} x Qty: {item.quantity}
                </p>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mt-auto pt-3 border-t border-gray-100">
        <span className="text-sm">
          {" "}
          status:{" "}
          <span className="font-semibold capitalize text-[#32CD32]">
            {data.shopOrders[0]?.status || "N/A"}
          </span>
        </span>

        <select
          onChange={(e) =>
            handleUpdateStatus(
              data._id,
              data.shopOrders[0]?.shop._id,
              e.target.value
            )
          }
          className="rounded-md border px-3 py-1 text-sm
        focus:outline-0 focus:ring-2 border-[#32CD32] text-[#32CD32]"
        >
          <option value="">Change Status</option>
          <option value="pending">Pending</option>
          <option value="preparing">Preparing</option>
          <option value="out for delivery">Out for delivery</option>
          <option value="delivered">Delivered</option>
        </select>
      </div>
      <div className="text-right font-bold text-gray-800 text-sm">
        Total: ₦{data.shopOrders[0]?.subtotal}
      </div>
    </div>
  );
};

export default OwnerCartOrder;
