import axios from "axios";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { serverUrl } from "../App";
import { useEffect } from "react";
import { useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import DeliveryBoyTracking from "../components/DeliveryBoyTracking";
import { useSelector } from "react-redux";

const TrackOrder = () => {
  const { orderId } = useParams();

  //Navigate
  const navigate = useNavigate();

  const { socket } = useSelector((state) => state.user);

  //USESTATE VARIABLE
  const [currentOrder, setCurrentOrder] = useState();
  const [liveLocation, setLiveLocation] = useState({});

  const handleGetOrder = async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/order/get-order-by-id/${orderId}`,
        { withCredentials: true }
      );
      setCurrentOrder(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetOrder();
  }, [orderId]);

  return (
    <div className="max-w-4xl mx-auto p-4 flex flex-col gap-6">
      <div className="relative flex items-center gap-4 top-[20px] left-[20px] z-[10] ">
        <IoIosArrowRoundBack
          size={35}
          className="text-[#32CD32] cursor-pointer"
          onClick={() => navigate("/")}
        />
        <h1 className="text-2xl font-bold md:text-center">Track Order</h1>
      </div>
      {currentOrder?.shopOrders?.map((shopOrder, index) => (
        <div
          className="bg-white p-4 rounded-2xl shadow-md border border-green-200"
          key={index}
        >
          <div>
            <p className="text-lg font-bold mb-2 text-[#32CD32]">
              {shopOrder.shop.name}
            </p>
            <p className="font-semibold">
              <span>Items:</span>{" "}
              {shopOrder.shopOrderItem?.map((i) => i.name).join(",")}
            </p>
            <p>
              <span className="font-semibold">Subtotal:</span> ₦
              {shopOrder.subtotal}
            </p>
            <p className="mt-6">
              <span className="font-semibold">Delivery Address:</span>{" "}
              {currentOrder.deliveryAddress?.text}
            </p>
          </div>

          <div>
            {shopOrder.status !== "delivered" ? (
              <>
                {shopOrder.assignedDeliveryBoy ? (
                  <div className="text-sm mt-4">
                    <p className="text-green-600 font-semibold">
                      Rider Name:{" "}
                      <span className="text-gray-700">
                        {shopOrder.assignedDeliveryBoy.fullName}
                      </span>
                    </p>
                    <p className="text-green-600 font-semibold">
                      Rider Contact:{" "}
                      <span className="text-gray-700">
                        {shopOrder.assignedDeliveryBoy.mobile}
                      </span>
                    </p>
                  </div>
                ) : (
                  <p className="font-semibold text-red-500">
                    No ChopNowRider has been been assigned yet
                  </p>
                )}
              </>
            ) : (
              <p className="text-green-600 font-semibold text-lg">Delivered</p>
            )}

            {shopOrder.assignedDeliveryBoy &&
              shopOrder.status !== "delivered" && (
                <div className="h-[400px] w-full rounded-2xl overflow-hidden shadow-md mt-4">
                  <DeliveryBoyTracking
                    data={{
                      deliveryBoyLocation: {
                        lat: shopOrder.assignedDeliveryBoy.location
                          .coordinates[1],
                        lon: shopOrder.assignedDeliveryBoy.location
                          .coordinates[0],
                      },
                      customerLocation: {
                        lat: currentOrder.deliveryAddress.latitude,
                        lon: currentOrder.deliveryAddress.longitude,
                      },
                    }}
                  />
                </div>
              )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TrackOrder;
