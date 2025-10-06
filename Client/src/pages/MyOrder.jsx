import React from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import UserCartOrder from "../components/userCartOrder";
import OwnerCartOrder from "../components/OwnerCartOrder";

const MyOrder = () => {
  const navigate = useNavigate();

  const { userData, myOrders } = useSelector((state) => state.user);
  return (
    <div className="w-full min-h-screen bg-[#fff9f6] flex justify-center px-4">
      <div className="w-full max-w-[800px] p-4">
        <div className="flex items-center gap-[20px] mb-6">
          <div className=" z-[10] ">
            <IoIosArrowRoundBack
              size={35}
              className="text-[#32CD32] cursor-pointer"
              onClick={() => navigate("/")}
            />
          </div>
          <h1 className="text-2xl font-bold text-start">My Orders</h1>
        </div>
        <div className="space-y-6">
          {myOrders?.map((order, index) =>
            userData.role === "user" ? (
              <UserCartOrder key={index} data={order} />
            ) : userData.role === "owner" ? (
              <OwnerCartOrder key={index} data={order} />
            ) : null
          )}
        </div>
      </div>
    </div>
  );
};

export default MyOrder;
