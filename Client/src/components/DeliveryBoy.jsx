import React from "react";
import Navbar from "./Navbar";
import { useSelector } from "react-redux";
import axios from "axios";
import { serverUrl } from "../App";
import { useEffect } from "react";
import { useState } from "react";

const DeliveryBoy = () => {
  const { userData } = useSelector((state) => state.user);

  //useState Variables
  const [availableAssignment, setAvailableAssignment] = useState(null);

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

  //useEffect
  useEffect(() => {
    getAssignment();
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
                  <button className="bg-[#32CD32] text-white px-4 py-1 rounded-lg text-sm
                  hover:bg-[#2bb62b] cursor-pointer">Accept</button>
                </div>
              ))
            ) : (
              <p className="text-red-500 text-sm">No Available Orders</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryBoy;
