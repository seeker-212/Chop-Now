import React from "react";
import Navbar from "./Navbar";
import { useSelector } from "react-redux";
import { FaUtensils } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { FaPen } from "react-icons/fa";
import OwnerItemCard from "./ownerItemCard";

const OwnerDashboard = () => {
  const { myShopData, ownerLoading } = useSelector((state) => state.owner);

  const navigate = useNavigate();

  if (ownerLoading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <p>Loading shop...</p>
      </div>
    );
  }

  return (
    <div className="w-screen min-h-screen flex flex-col gap-5 items-center bg-[#fff9f6] overflow-y-auto">
      <Navbar />

      {!myShopData && (
        <div className="flex justify-center items-center p-4 sm:p-6">
          <div
            className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6 border border-gray-100
            hover:shadow-xl transistion-shadow duration-300"
          >
            <div className="flex flex-col items-center text-center">
              <FaUtensils className="text-[#32CD32] w-16 h-16 sm:w-20 sm:h-20 mb-4" />
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                Add Your Restaurant
              </h2>
              <p className="text-gray-600 mb-4 text-sm sm:text-base">
                Join our food delivery platform and reach thousands of amazing
                customers daily
              </p>
              <button
                onClick={() => navigate("/create-edit-shop")}
                className="bg-[#32CD32] text-white px-5 sm:px-6 py-2 rounded-full font-medium
                shadow-md hover:bg-green-600 transition-colors duration-200 cursor-pointer"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      )}

      {myShopData && (
        <div className="w-full flex flex-col items-center gap-6 px-4 sm:px-6">
          <h1
            className="text-2xl sm:text-3xl text-gray-900 flex items-center gap-3
           text-center mt-8"
          >
            <FaUtensils className="text-[#32CD32] w-8 h-8 sm:w-10 sm:h-20" />
            Welcome to {myShopData.name}
          </h1>

          <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-green-100
          hover:shadow-2xl transition-all duration-300 w-full max-w-3xl relative">
            <div className="absolute top-4 right-4 bg-[#32CD32] text-white p-2 rounded-full shadow-md
            hover:bg-green-600 transition-colors cursor-pointer"
            onClick={()=>navigate('/create-edit-shop')}>
              <FaPen size={20} />
            </div>
            <img src={myShopData.image} alt="" className="w-full h-48 sm:h-64 object-cover" />

            <div className="p-4 sm:p-6">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">{myShopData.name}</h1>
            <p className="text-gray-500">{myShopData.city}</p>
            <p className="text-gray-500 mb-4">{myShopData.address}</p>
          </div>
          </div>

          {myShopData.items.length === 0 && (
            <div>
              <div className="flex justify-center items-center p-4 sm:p-6">
          <div
            className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6 border border-gray-100
            hover:shadow-xl transistion-shadow duration-300"
          >
            <div className="flex flex-col items-center text-center">
              <FaUtensils className="text-[#32CD32] w-16 h-16 sm:w-20 sm:h-20 mb-4" />
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                Add Your Food Item
              </h2>
              <p className="text-gray-600 mb-4 text-sm sm:text-base">
                Share your delicious creation with our customers by adding them to the 
                menu.
              </p>
              <button
                onClick={() => navigate("/add-food")}
                className="bg-[#32CD32] text-white px-5 sm:px-6 py-2 rounded-full font-medium
                shadow-md hover:bg-green-600 transition-colors duration-200 cursor-pointer"
              >
                Add Food
              </button>
            </div>
          </div>
        </div>
            </div>
          )}

          {myShopData.items.length > 0 && (
            <div className="flex flex-col items-center gap-4 w-full max-w-3xl">
              {myShopData.items.map((item, index)=> (
                <OwnerItemCard data={item} key={index} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OwnerDashboard;
