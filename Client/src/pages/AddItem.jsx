import React, { useRef, useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaUtensils } from "react-icons/fa";
import axios from "axios";
import { serverUrl } from "../App";
import { setMyShopData } from "../redux/ownerSlice.js";
import { ClipLoader } from "react-spinners";

const AddItem = () => {
  //Navigator
  const navigate = useNavigate();

  //Getting Data from MYSHOPSLICE
  const { myShopData } = useSelector((state) => state.owner);

  //useState variables
  const [name, setName] = useState("");
  const [frontendImage, setFrontendImage] = useState(null);
  const [backendImage, setBackendImage] = useState(null);
  const [price, setPrice] = useState(0);
  const [category, setCategory] = useState("");
  const [foodType, setFoodType] = useState("veg");
  const [loading, setLoading] = useState(false)

  //Creating a CATEGORY ARRAY
  const categories = [
    "Snacks",
    "Main Course",
    "Desserts",
    "Pizza",
    "Burgers",
    "Sandwiches",
    "Eastern Naija",
    "Southern Naija",
    "chinese",
    "Fast Food",
    "Others",
  ];

  //UseDispatch
  const dispatch = useDispatch();

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
      formData.append("category", category);
      formData.append("foodType", foodType);
      formData.append("price", price);

      //Checking if backend has the image available
      if (backendImage) {
        formData.append("image", backendImage);
      }
      const result = await axios.post(
        `${serverUrl}/api/item/add-item`,
        formData,
        { withCredentials: true }
      );
      dispatch(setMyShopData(result.data));
      setLoading(false)
      navigate('/')
    } catch (error) {
      console.log(error);
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
          <div className="text-3xl font-extrabold text-gray-900">Add Food</div>
        </div>

        {/* Form Section */}
        <form onSubmit={submitHandler} className="space-y-5">
          {/* NAME SECTION */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              type="text"
              placeholder="Enter Food Name"
              className="w-full px-4 py-3
                border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          {/* FOOD IMAGE SECTION */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Food Image
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
          {/* PRICE SECTION */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price
            </label>
            <input
              onChange={(e) => setPrice(e.target.value)}
              value={price}
              type="number"
              placeholder="0"
              className="w-full px-4 py-3
                border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          {/* CATEGORY SECTION */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Available Food Category
            </label>
            <select
              onChange={(e) => setCategory(e.target.value)}
              value={category}
              className="w-full px-4 py-3
                border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
                <option value="">select category</option>
                {categories.map((cate, index) => (
                    <option value={cate} key={index}>{cate}</option>
                ))}
            </select>
          </div>
          {/* FOODTYPE SECTION */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select FoodType
            </label>
            <select
              onChange={(e) => setFoodType(e.target.value)}
              value={foodType}
              className="w-full px-4 py-3
                border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
                <option value="veg">Veg</option>
                <option value="non veg">Non Veg</option>
                
            </select>
          </div>
          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            className="w-full bg-[#32CD32] text-white px-6 py-3 rounded-lg font-semibold
          shadow-md hover:bg-green-600 hover:shadow-lg transition-all duration-200
          cursor-pointer"
          disabled={loading}
          >
            {loading ? <ClipLoader size={20} color="white" />: "Create Item" }
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddItem;
