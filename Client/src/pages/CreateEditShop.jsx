import React, { useRef, useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaUtensils } from "react-icons/fa";
import axios from "axios";
import { serverUrl } from "../App";
import { setMyShopData } from "../redux/ownerSlice.js";
import { use } from "react";
import { ClipLoader } from "react-spinners";

const CreateEditShop = () => {
  //Navigator
  const navigate = useNavigate();

  //Getting Data from MYSHOPSLICE
  const { myShopData } = useSelector((state) => state.owner);
  const { city, state, currentAddress } = useSelector((state) => state.user);

  //useState variables
  const [name, setName] = useState(myShopData?.name || "");
  const [currentcity, setCurrentCity] = useState(
    myShopData?.city || city || ""
  );
  const [currentState, setCurrentState] = useState(
    myShopData?.state || state || ""
  );
  const [address, setAddress] = useState(
    myShopData?.address || currentAddress || ""
  );
  const [frontendImage, setFrontendImage] = useState(myShopData?.image || null);
  const [backendImage, setBackendImage] = useState(null);
  const [loading, setLoading] = useState(false)

  //UseDispatch
  const dispatch = useDispatch()

  // This function handles image uploading on the frontend
  const handleImage = (e) => {
    const file = e.target.files[0];
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  };

  //This function will handle the form submision
  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true)
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("city", city);
      formData.append("state", state);
      formData.append("address", address);

      //Checking if backend has the image available
      if (backendImage) {
        formData.append("image", backendImage);
      }
      console.log([...formData]);
      const result = await axios.post(
        `${serverUrl}/api/shop/create-edit`,
        formData,
        { withCredentials: true }
      );
      dispatch(setMyShopData(result?.data))
      setLoading(false)
      navigate('/')
      console.log(result.data)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  };

  return (
    <div
      className="flex justify-center flex-col items-center p-6 bg-gradient-to-br from-green-50 relative
    to-white min-h-screen"
    >
      {/* Navigate back to the home page */}
      <div className="absolute top-[20px] left-[20px] z-[10] mb-[10px]">
        <IoIosArrowRoundBack
          size={35}
          className="text-[#32CD32] cursor-pointer"
          onClick={() => navigate("/")}
        />
      </div>

      {/* My shop Data section */}
      <div className="max-w-lg w-full bg-white shadow-xl rounded-2xl p-8 border border-green-100">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-green-100 p-4 rounded-full mb-4">
            <FaUtensils className="text-[#32CD32] w-16 h-16" />
          </div>
          <div className="text-3xl font-extrabold text-gray-900">
            {myShopData ? "Edit Shop" : "Add Shop"}
          </div>
        </div>

        {/* Form Section */}
        <form onSubmit={submitHandler} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              type="text"
              placeholder="Enter Shop Name"
              className="w-full px-4 py-3
                border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Shop Image
            </label>
            <input
              onChange={handleImage}
              type="file"
              accept="image/*"
              className="w-full px-4 py-3
                border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {frontendImage && (
              <div className="mt-4">
                <img
                  src={frontendImage}
                  alt=""
                  className="w-full h-48 object-cover rounded-lg border 
              border-gray-300"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <input
                onChange={(e) => setCurrentCity(e.target.value)}
                value={currentcity}
                type="text"
                placeholder="City"
                className="w-full px-4 py-3
                border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State
              </label>
              <input
                onChange={(e) => setCurrentState(e.target.value)}
                value={currentState}
                type="text"
                placeholder="State"
                className="w-full px-4 py-3
                border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <input
              onChange={(e) => setAddress(e.target.value)}
              value={address}
              type="text"
              placeholder="Enter Shop Address"
              className="w-full px-4 py-3
                border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#32CD32] text-white px-6 py-3 rounded-lg font-semibold
          shadow-md hover:bg-green-600 hover:shadow-lg transition-all duration-200
          cursor-pointer"
          disabled={loading}
          >
            {loading ? <ClipLoader size={20} color="white" /> : "Save" }
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateEditShop;
