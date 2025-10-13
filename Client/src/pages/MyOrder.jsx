import React from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import UserCartOrder from "../components/userCartOrder";
import OwnerCartOrder from "../components/OwnerCartOrder";
import { useEffect } from "react";
import { setMyOrders } from "../redux/userSlice";

const MyOrder = () => {
  //Navigator
  const navigate = useNavigate();
  //Destructing from userSlice
  const { userData, myOrders, socket } = useSelector((state) => state.user);

  //dispatch
  const dispatch = useDispatch();

  //UseEffect
  useEffect(() => {
    if (!socket) return;

    const handleNewOrder = (data) => {
      // console.log("SOCKET DATA:", data);

      // Only add to owner's orders if this order belongs to them
      if (data.shopOrder?.owner?._id === userData._id) {
        dispatch(
          setMyOrders([
            {
              _id: data.orderId,
              paymentMethod: data.paymentMethod,
              user: data.user,
              deliveryAddress: data.deliveryAddress,
              createdAt: data.createdAt,
              totalAmount: data.totalAmount,
              shopOrders: [data.shopOrder],
            },
            ...myOrders,
          ])
        );
      }
    };

    socket.on("newOrder", handleNewOrder);

    return () => {
      socket.off("newOrder", handleNewOrder);
    };
  }, [socket, userData, myOrders, dispatch]);

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
