import React, { useState } from "react";
import {
  FaDrumstickBite,
  FaLeaf,
  FaMinus,
  FaPlus,
  FaShoppingCart,
  FaStar,
} from "react-icons/fa";
import { FaRegStar } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/userSlice";

const FoodCard = ({ data }) => {
  //USESELECTOR
  const { cartItems } = useSelector((state) => state.user);

  //USEDISPATCH
  const dispatch = useDispatch();

  const [quantity, setQuantity] = useState(0);

  //Star Rating
  const renderStar = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= rating ? (
          <FaStar key={i} className="text-yellow-500 text-lg" />
        ) : (
          <FaRegStar key={i} className="text-yellow-500 text-lg" />
        )
      );
    }
    return stars;
  };

  //Handle Quantity Increase
  const handleIncrease = () => {
    const newQty = quantity + 1;
    setQuantity(newQty);
  };

  //Handle Quantity Decrease
  const handleDecrease = () => {
    if (quantity > 0) {
      const newQty = quantity - 1;
      setQuantity(newQty);
    }
  };

  return (
    <div
      className="w-[250px] rounded-2xl border-2 border-[#32CD32] bg-white shadow-md overflow-hidden
    hover:shadow-xl transition-all duration-300 flex flex-col"
    >
      <div className="relative w-full h-[170px] flex justify-center items-center bg-white">
        <div className="absolute top-3 right-3 bg-white rounded-full p-1 shadow">
          {data.foodType === "veg" ? (
            <FaLeaf className="text-green-600 text-lg" />
          ) : (
            <FaDrumstickBite className="text-red-600 text-lg" />
          )}
        </div>
        <img
          src={data.image}
          alt=""
          className="w-full h-full object-cover transition-transform
            duration-300 hover:scale-105"
        />
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h1 className="font-semibold text-gray-900 text-base truncate">
          {data.name}
        </h1>
        <div className="flex items-center gap-1 mt-1">
          {renderStar(data.rating?.average || 0)}
          <span className="text-xs text-gray-500">
            {data.rating?.count || 0}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between mt-auto p-4">
        <span className="font-bold text-gray-900 text-lg">{data.price}</span>

        <div className="flex items-center border rounded-full overflow-hidden shadow-sm">
          <button className="px-2 pt-1 hover: bg-gray-100 transition">
            <FaMinus size={12} color="red" onClick={handleDecrease} />
          </button>
          <span>{quantity}</span>
          <button className="px-2 pt-1 hover: bg-gray-100 transition">
            <FaPlus size={12} color="green" onClick={handleIncrease} />
          </button>
          <button
            onClick={() =>
              dispatch(
                addToCart({
                  id: data._id,
                  name: data.name,
                  price: data.price,
                  image: data.image,
                  shop: data.shop,
                  quantity,
                  foodType: data.foodType,
                })
              )
            }
            className={`${cartItems.some(
              (i) => i.id === data._id
            ) ? 'bg-gray-800' : 'bg-[#32CD32]'} text-white px-3 py-2 transition-colors cursor-pointer `}
          >
            <FaShoppingCart size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
