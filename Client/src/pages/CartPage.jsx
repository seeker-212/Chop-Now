import React from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CartItem from "../components/CartItem";

const CartPage = () => {
  //Navigate
  const navigate = useNavigate();

  //USESELECTOR
  const { cartItems, totalAmount } = useSelector((state) => state.user);

  return (
    <div className="min-h-screen bg-[#fff9f6] flex justify-center p-6">
      <div className="w-full max-w-[800px] relative">
        <div className="flex items-center gap-[20px] mb-6">
          <div className=" z-[10] ">
            <IoIosArrowRoundBack
              size={35}
              className="text-[#32CD32] cursor-pointer"
              onClick={() => navigate("/")}
            />
          </div>
          <h1 className="text-2xl font-bold text-start">Cart Page</h1>
        </div>
        {cartItems?.length === 0 ? (
          <p className="text-gray-500 text-lg text-center">
            Your Cart is Empty
          </p>
        ) : (
          <>
            <div>
              {cartItems?.map((item, index) => (
                <CartItem key={index} data={item} />
              ))}
            </div>

            {/* TOTAL AMOUNT SECTION */}
            <div
              className="mt-6 bg-white p-4 rounded-xl shadow flex justify-between 
            items-center border border-gray-300"
            >
              <h1 className="text-lg font-semibold">Total Amount</h1>
              <span className="text-xl font-bold text-[#32CD32]">
                ₦{" "}
                {totalAmount.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>

            {/* CHECKOUT SECTION */}
            <div className="mt-4 flex justify-end">
              <button
                className="bg-[#32CD32] text-white px-6 py-3 rounded-lg text-lg font-medium
              hover:bg-green-700 transition cursor-pointer"
                onClick={() => navigate("/checkout")}
              >
                Proceed To CheckOut
              </button>
            </div>
            <div></div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartPage;
