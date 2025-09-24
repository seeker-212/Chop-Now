import React from "react";
import Navbar from "./Navbar";
import { useSelector } from "react-redux";
import { FaUtensils } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const OwnerDashboard = () => {
  const { myShopData } = useSelector((state) => state.owner);

  const navigate = useNavigate()

  return (
    <div className="w-[100vw] min-h-[100vh] pt-[100px] flex flex-col items-center bg-[#fff9f6]">
      <Navbar />

      {!myShopData && (
        <div className="flex justify-center items-center p-4 sm:p-6">
          <div
            className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6 border border-gray-100
            hover:shadow-xl transistion-shadow duration-300"
          >
            <div className="flex flex-col items-center text-center">
              <FaUtensils className="text-[#32CD32] w-16 h-16 sm:w-20 sm:h-20 mb-4"/>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Add Your Restaurant</h2>
              <p className="text-gray-600 mb-4 text-sm sm:text-base">
                Join our food delivery platform and reach thousands of amazing customers daily</p>
                <button
                onClick={()=>navigate('/create-edit-shop')}
                 className="bg-[#32CD32] text-white px-5 sm:px-6 py-2 rounded-full font-medium
                shadow-md hover:bg-green-600 transition-colors duration-200 cursor-pointer">
                  Get Started</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerDashboard;
