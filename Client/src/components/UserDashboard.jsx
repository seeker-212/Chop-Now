import React, { useEffect, useRef, useState } from "react";
import Navbar from "./Navbar";
import { categories } from "../assets/category";
import CategoryCard from "./CategoryCard";
import { FaChevronCircleLeft, FaChevronCircleRight } from "react-icons/fa";
import { useSelector } from "react-redux";
import FoodCard from "./FoodCard";

const UserDashboard = () => {
  //Destructing
  const { city, shopInMyCity, itemInMyCity } = useSelector(
    (state) => state.user
  );

  //USEREF
  const cateScrollRef = useRef();
  const shopScrollRef = useRef();

  //USESATE
  const [showLeftCateButton, setShowLeftCateButton] = useState(false);
  const [showRightCateButton, setShowRightCateButton] = useState(false);
  const [showLeftShopButton, setShowLeftShopButton] = useState(false);
  const [showRightShopButton, setShowRightShopButton] = useState(false);

  //Update button functiin
  const updateButton = (ref, setLeftButton, setRightButton) => {
    const element = ref.current;
    if (element) {
      setLeftButton(element.scrollLeft > 0);
      setRightButton(
        element.scrollLeft + element.clientWidth < element.scrollWidth
      );
    }
  };

  //this will handle x axis scroll
  const scrollHandler = (ref, direction) => {
    if (ref.current) {
      ref.current.scrollBy({
        left: direction === "left" ? -200 : 200,
        behavior: "smooth",
      });
    }
  };

  //UseEffect
  useEffect(() => {
    const handleCateScroll = () => {
      updateButton(
        cateScrollRef,
        setShowLeftCateButton,
        setShowRightCateButton
      );
    };

    const handleShopScroll = () => {
      updateButton(
        shopScrollRef,
        setShowLeftShopButton,
        setShowRightShopButton
      );
    };

    if (cateScrollRef.current) {
      handleCateScroll(); // run once on mount
      cateScrollRef.current.addEventListener("scroll", handleCateScroll);
    }
    if (shopScrollRef.current) {
      handleShopScroll(); // run once on mount
      shopScrollRef.current.addEventListener("scroll", handleShopScroll);
    }

    return () => {
      if (cateScrollRef.current) {
        cateScrollRef.current.removeEventListener("scroll", handleCateScroll);
      }
      if (shopScrollRef.current) {
        shopScrollRef.current.removeEventListener("scroll", handleShopScroll);
      }
    };
  }, [shopInMyCity, itemInMyCity]); // listen for state updates

  return (
    <div className="w-screen min-h-screen flex flex-col gap-5 items-center bg-[#fff9f6] overflow-y-auto">
      <Navbar />

      {/* Inspired section */}
      <div className="w-full max-w-6xl flex flex-col gap-5 items-start p-[10px]">
        <h1 className="text-gray-800 text-2xl sm:text-3xl">
          Inspiration for your first order
        </h1>
        <div className="w-full relative">
          {showLeftCateButton && (
            <button
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-[#32CD32] text-white p-2
          rounded-full shaodw-lg hover:bg-green-700 z-10 cursor-pointer"
              onClick={() => scrollHandler(cateScrollRef, "left")}
            >
              <FaChevronCircleLeft />
            </button>
          )}

          <div
            className="w-full flex overflow-x-auto gap-4 pb-2"
            ref={cateScrollRef}
          >
            {categories.map((cate, index) => (
              <CategoryCard
                name={cate.category}
                image={cate.image}
                key={index}
              />
            ))}
          </div>
          {showRightCateButton && (
            <button
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-[#32CD32] text-white p-2
          rounded-full shaodw-lg hover:bg-green-700 z-10 cursor-pointer"
              onClick={() => scrollHandler(cateScrollRef, "right")}
            >
              <FaChevronCircleRight />
            </button>
          )}
        </div>
      </div>

      {/* Shop Section */}
      <div className="w-full max-w-6xl flex flex-col gap-5 items-start p-[10px]">
        <h1 className="text-gray-800 text-2xl sm:text-3xl">
          Best Shop in {city}
        </h1>
        <div className="w-full relative">
          {showLeftShopButton && (
            <button
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-[#32CD32] text-white p-2
          rounded-full shaodw-lg hover:bg-green-700 z-10 cursor-pointer"
              onClick={() => scrollHandler(shopScrollRef, "left")}
            >
              <FaChevronCircleLeft />
            </button>
          )}

          <div
            className="w-full flex overflow-x-auto gap-4 pb-2"
            ref={shopScrollRef}
          >
            {shopInMyCity?.map((shop, index) => (
              <CategoryCard name={shop.name} image={shop.image} key={index} />
            ))}
          </div>
          {showRightShopButton && (
            <button
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-[#32CD32] text-white p-2
          rounded-full shaodw-lg hover:bg-green-700 z-10 cursor-pointer"
              onClick={() => scrollHandler(shopScrollRef, "right")}
            >
              <FaChevronCircleRight />
            </button>
          )}
        </div>
      </div>

      {/* Suggested Food Item Section */}
      <div className="w-full max-w-6xl flex flex-col gap-5 items-start p-[10px]">
        <h1 className="text-gray-800 text-2xl sm:text-3xl">
          Suggested Food Item
        </h1>
        <div className="w-full h-auto flex flex-wrap gap-[20px] justify-center">
          {itemInMyCity?.map((item, index) => (
            <FoodCard data={item} key={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
