import React from "react";
import Navbar from "./Navbar";
import { useSelector } from "react-redux";

const DeliveryBoy = () => {
  const { userData } = useSelector((state) => state.user);

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
            <span className="font-semibold">Latitude:</span> {userData.location.coordinates[1]},{" "}
            <span className="font-semibold">longitude:</span> {userData.location.coordinates[0]}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DeliveryBoy;
