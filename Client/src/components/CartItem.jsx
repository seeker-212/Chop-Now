import React from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import { CiTrash } from "react-icons/ci";
import { useDispatch } from "react-redux";
import { removeItem, updateQuantity } from "../redux/userSlice";

const CartItem = ({ data }) => {
  //USEDISPATCH
  const dispatch = useDispatch();

  //This will handle cart item increase
  const handleIncrease = (id, currentQty) => {
    dispatch(updateQuantity({ id, quantity: currentQty + 1 }));
  };

  //This will handle cart item decrease
  const handleDecrease = (id, currentQty) => {
    dispatch(updateQuantity({ id, quantity: currentQty - 1 }));
  };

  return (
    <div
      className="flex items-center justify-between bg-white p-4 rounded-xl shadow border border-gray-300
    mb-2"
    >
      {/* LEFT SIDE */}
      <div className="flex items-center gap-4">
        <img
          src={data.image}
          alt="Item-image"
          className="w-20 h-20 object-cover rounded-lg border"
        />
        <div>
          <h1 className="font-medium text-gray-800">{data.name}</h1>
          <p className="text-sm text-gray-500">₦ {data.price}</p>
          <p className="font-bold text-gray-900">
            ₦ {data.price * data.quantity}
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-3">
        <button
          className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 cursor-pointer"
          onClick={() => handleDecrease(data.id, data.quantity)}
        >
          {/* --------Handle Decrease-------- */}
          <FaMinus size={12} color="red" />
        </button>
        <span>{data.quantity}</span>
        <button
          className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 cursor-pointer"
          onClick={() => handleIncrease(data.id, data.quantity)}
        >
          {/* --------Handle Increase-------- */}
          <FaPlus size={12} color="green" />
        </button>

        <button
          className="p-2 text-red-600 rounded-full hover:bg-red-200 cursor-pointer"
          onClick={() => dispatch(removeItem(data.id))}
        >
          <CiTrash size={20} />
        </button>
      </div>
    </div>
  );
};

export default CartItem;
