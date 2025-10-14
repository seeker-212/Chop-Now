import React from "react";
import Navbar from "./Navbar";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { serverUrl } from "../App";
import { useEffect } from "react";
import { useState } from "react";
import DeliveryBoyTracking from "./DeliveryBoyTracking";

const DeliveryBoy = () => {
  const { userData, socket } = useSelector((state) => state.user);

  //Dispatch
  const dispatch = useDispatch()

  //useState Variables
  const [currentOrder, setCurrentOrder] = useState();
  const [showOtpBox, setShowOtpBox] = useState(false);
  const [availableAssignment, setAvailableAssignment] = useState(null);
  const [otp, setOtp] = useState("");

  const getAssignment = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/order/get-assignment`, {
        withCredentials: true,
      });
      setAvailableAssignment(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getCurrentOrder = async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/order/get-current-order`,
        { withCredentials: true }
      );
      setCurrentOrder(result.data);
      console.log(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  const acceptOrder = async (assignmentId) => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/order/accept-order/${assignmentId}`,
        { withCredentials: true }
      );
      setAvailableAssignment(result.data);
      console.log(result.data);
      await getCurrentOrder();
    } catch (error) {
      console.log(error);
    }
  };

  const sendOtp = async () => {
    try {
      const result = await axios.post(
        `${serverUrl}/api/order/send-delivery-otp`,
        { orderId: currentOrder._id, shopOrderId: currentOrder.shopOrder._id },
        { withCredentials: true }
      );
      console.log(result.data);
      setShowOtpBox(true);
    } catch (error) {
      console.log(error);
    }
  };

  const verifyOtp = async () => {
    try {
      const result = await axios.post(
        `${serverUrl}/api/order/verify-delivery-otp`,
        {
          orderId: currentOrder._id,
          shopOrderId: currentOrder.shopOrder._id,
          otp,
        },
        { withCredentials: true }
      );
      console.log(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(()=>{
    socket?.on('newAssignment', (data) => {
      if (data.sentTo === userData._id) {
        setAvailableAssignment(prev => [...prev, data])
      }
    })

    return () => {
      socket?.off('newAssignment')
    }
  },[socket])

  //useEffect
  useEffect(() => {
    getAssignment();
    getCurrentOrder();
  }, [userData]);

  return (
    <div className="w-screen min-h-screen flex flex-col gap-5 items-center bg-[#fff9f6] overflow-y-auto">
      <Navbar />

      <div className="w-full max-w-[800px] flex flex-col gap-5 items-center">
        <div
          className="bg-white rounded-2xl shadow-md p-5 flex flex-col justify-start items-center
        w-[90%] border border-green-100 text-center gap-2"
        >
          <h1 className="text-xl font-bold text-[#32CD32]">
            Welcome, {userData.fullName}
          </h1>
          <p className="text-[#32CD32]">
            <span className="font-semibold">Latitude:</span>{" "}
            {userData.location.coordinates[1]},{" "}
            <span className="font-semibold">longitude:</span>{" "}
            {userData.location.coordinates[0]}
          </p>
        </div>
        {!currentOrder && (
          <div className="bg-white rounded-2xl p-5 shadow-md w-[90%] border border-green-100">
            <h1 className="text-lg font-bold mb-4 flex items-center gap-2">
              Available Orders
            </h1>

            <div className="space-y-4">
              {availableAssignment?.length > 0 ? (
                availableAssignment.map((a, index) => (
                  <div
                    className="border rounded-lg p-4 flex justify-between items-center"
                    key={index}
                  >
                    <div>
                      <p className="text-sm font-semibold">
                        <span className="">{a?.shopName}</span>
                      </p>
                      <p className="text-sm font-semibold">
                        Delivery Address:{" "}
                        <span className="font-semibold text-gray-500">
                          {a?.deliveryAddress.text}
                        </span>
                      </p>
                      <p className="text-xs font-semibold text-gray-500">
                        {a.items.length} items | ₦{a.subtotal}
                      </p>
                    </div>
                    <button
                      onClick={() => acceptOrder(a.assignmentId)}
                      className="bg-[#32CD32] text-white px-4 py-1 rounded-lg text-sm
                  hover:bg-[#2bb62b] cursor-pointer"
                    >
                      Accept
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-red-500 text-sm">No Available Orders</p>
              )}
            </div>
          </div>
        )}

        {currentOrder && (
          <div className="bg-white rounded-2xl p-5 shadow-md w-[90%] border border-green-100">
            <h2 className="text-lg font-bold mb-3">📦Current Order</h2>
            <div className="border border-gray-300 rounded-lg p-4 mb-3">
              <p className="font-semibold text-sm">
                {currentOrder?.shopOrder.shop.name}
              </p>
              <p className="text-sm text-gray-500">
                {currentOrder.deliveryAddress.text}
              </p>
              <p className=" text-gray-400">
                {currentOrder.shopOrder.shopOrderItem.length} items | ₦
                {currentOrder.shopOrder.subtotal}
              </p>
            </div>
            <DeliveryBoyTracking data={currentOrder} />
            {!showOtpBox ? (
              <button
                onClick={sendOtp}
                className="mt-4 w-full bg-green-500 text-white font-semibold py-2 px-4
            rounded-xl shadow-md hover:bg-green-600 active:scale-95 transition-all duration-200 cursor-pointer"
              >
                Mark As Delivered
              </button>
            ) : (
              <div className="mt-4 p-4 border border-gray-300 rounded-xl bg-gray-50">
                <p>
                  Enter Otp Sent To{" "}
                  <span className="text-green-500">
                    {currentOrder.user.fullName}
                  </span>
                </p>
                <input
                  onChange={(e) => setOtp(e.target.value)}
                  value={otp}
                  type="text"
                  className="w-full border border-gray-400 px-3 py-2 rounded-lg mb-3
                outline-none focus:ring-2 focus:ring-green-400"
                  placeholder="Enter OTP"
                />
                <button
                  onClick={verifyOtp}
                  className="w-full bg-green-500 text-white py-2 rounded-lg font-semibold
                hover:bg-green-600 transition-all"
                >
                  Submit OTP
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryBoy;
