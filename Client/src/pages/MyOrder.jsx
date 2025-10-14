import React from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import UserCartOrder from "../components/userCartOrder";
import OwnerCartOrder from "../components/OwnerCartOrder";
import { useEffect } from "react";
import { setMyOrders, updateRealtimeOrderStatus } from "../redux/userSlice";

const MyOrder = () => {
  //Navigator
  const navigate = useNavigate();
  //Destructing from userSlice
  const { userData, myOrders, socket } = useSelector((state) => state.user);

  //dispatch
  const dispatch = useDispatch();

  //UseEffect
  useEffect(() => {
    // Listen to ALL socket events for debugging

    const handleNewOrder = (data) => {
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

    const handleUpdateStatus = ({ orderId, shopId, status, userId }) => {
      console.log("update-status received:", {
        orderId,
        shopId,
        status,
        userId,
      });

      if (userId === userData._id) {
        dispatch(updateRealtimeOrderStatus({ orderId, shopId, status }));
      } else {
        console.log("update-status ignored: userId mismatch", {
          local: userData._id,
          received: userId,
        });
      }
    };

    socket.on("newOrder", handleNewOrder);
    socket.on("update-status", handleUpdateStatus);

    return () => {
      socket.off("newOrder", handleNewOrder);
      socket.off("update-status", handleUpdateStatus);
      socket.offAny();
    };
  }, [socket, userData?._id, dispatch]);

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
