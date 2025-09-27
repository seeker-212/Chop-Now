import React, { use, useState } from "react";
import { FaLocationDot } from "react-icons/fa6";
import { IoIosSearch } from "react-icons/io";
import { FiShoppingCart } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { RxCross2 } from "react-icons/rx";
import axios from "axios";
import { serverUrl } from "../App";
import { setUserData } from "../redux/userSlice";
import { FaPlus } from "react-icons/fa";
import { TbReceipt2 } from "react-icons/tb";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  //Will get the user info from the UserSlice
  const { userData, city } = useSelector((state) => state.user);
  const { myShopData } = useSelector((state) => state.owner);

  //Use State variable
  const [showInfo, setShowInfo] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  //Dispatch
  const dispatch = useDispatch();

  //Navigator
  const navigate = useNavigate();

  // This function will handle user Logout
  const logoutHandler = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/auth/signout`, {
        withCredentials: true,
      });
      dispatch(setUserData(null));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className="w-full h-[80px] flex items-center justify-between md:justify-center gap-[30px]
    px-[20px] fixed top-0 z-[9999] bg-[#fff9f6] overflow-visible"
    >
      {/* This Show search works for the small screen */}
      {showSearch && userData.role === "user" && (
        <div
          className="w-[90%] h-[70px] bg-white shadow-xl rounded-lg items-center gap-[20px]
        flex fixed top-[80px] left-[5%] md:hidden"
        >
          <div
            className="flex items-center w-[30%] overflow-hidden gap-[10px] px-[10px] border-r-[2px]
        border-gray-300"
          >
            <FaLocationDot size={25} className="text-[#32CD32]" />
            <div className="w-[80%] truncate text-gray-600">{city}</div>
          </div>
          <div className="w-[80%] flex items-center gap-[10px]">
            <IoIosSearch size={25} className="text-[#32CD32]" />
            <input
              type="text"
              placeholder="Pick your cravings.."
              className="text-gray-700 px-[10px] outline-0 w-full"
            />
          </div>
        </div>
      )}

      {/* -----------This Website logo---------- */}
      <h1 className="md:text-3xl text-xl font-bold mb-2 text-[#32CD32]">
        ChopNow
      </h1>

      {/* This Search work for the bigger screen */}
      {userData.role === "user" && (
        <div
          className="md:w-[60%] lg:w-[40%] h-[70px] bg-white shadow-xl rounded-lg items-center
      gap-[20px] hidden md:flex"
        >
          <div
            className="flex items-center w-[30%] overflow-hidden gap-[10px] px-[10px] border-r-[2px]
        border-gray-300"
          >
            <FaLocationDot size={25} className="text-[#32CD32]" />
            <div className="w-[80%] truncate text-gray-600">{city}</div>
          </div>
          <div className="w-[80%] flex items-center gap-[10px]">
            <IoIosSearch size={25} className="text-[#32CD32]" />
            <input
              type="text"
              placeholder="Pick your cravings.."
              className="text-gray-700 px-[10px] outline-0 w-full"
            />
          </div>
        </div>
      )}

      <div className="flex gap-4 items-center">
        {/* This search bar ony appear for small screen */}
        {userData.role === "user" &&
          (showSearch ? (
            <RxCross2
              size={25}
              className="text-[#32CD32] md:hidden"
              onClick={() => setShowSearch(false)}
            />
          ) : (
            <IoIosSearch
              size={25}
              className="text-[#32CD32] md:hidden"
              onClick={() => setShowSearch(true)}
            />
          ))}

        {/* Button  is meant for Shop owner and it add food items */}
        {userData.role === "owner" ? (
          <>
            {myShopData && (
              <>
                <button
                  onClick={() => navigate("/add-food")}
                  className="hidden md:flex items-center gap-1 p-2 cursor-pointer rounded-full
              bg-[#32CD32]/10 text-[#32CD32]"
                >
                  <FaPlus size={13} />
                  <span>Add Food Item</span>
                </button>

                {/* Making the button visible for smaller screen  */}
                <button
                  onClick={() => navigate("/add-food")}
                  className="md:hidden flex items-center gap-1 p-2 cursor-pointer rounded-full
              bg-[#32CD32]/10 text-[#32CD32]"
                >
                  <FaPlus size={13} />
                </button>
              </>
            )}

            {/* For larger Screen */}
            <div
              className="hidden md:flex items-center gap-2 cursor-pointer relative px-3 py-1 rounded-lg
            bg-[#32CD32]/10 text-[#32CD32] font-medium"
            >
              <TbReceipt2 size={20} />
              <span>Orders</span>
              <span
                className="absolute -right-2 -top-2 text-xs font-bold text-white bg-[#32CD32]
              rounded-full px-[6px] py-[1px]"
              >
                0
              </span>
            </div>

            {/* For smaller screen */}
            <div
              className="md:hidden flex items-center gap-2 cursor-pointer relative px-3 py-1 rounded-lg
            bg-[#32CD32]/10 text-[#32CD32] font-medium"
            >
              <TbReceipt2 size={20} />
              <span
                className="absolute -right-2 -top-2 text-xs font-bold text-white bg-[#32CD32]
              rounded-full px-[6px] py-[1px]"
              >
                0
              </span>
            </div>
          </>
        ) : (
          <>
            {/* This shopping cart section */}

            <div className="relative cursor-pointer">
              <FiShoppingCart size={25} className="text-[#32CD32]" />
              <span className="absolute right-[-9px] top-[-12px] text-[#32CD32]">
                0
              </span>
            </div>

            {/* This my ORDERS section works for medium screen and above */}
            <button
              className="hidden md:block px-3 py-1 rounded-lg bg-[#32CD32]/10 text-[#32CD32]
      cursor-pointer text-sm font-medium"
            >
              My Orders
            </button>
          </>
        )}

        {/* This is the user profile section */}
        <div
          onClick={() => setShowInfo((prev) => !prev)}
          className="w-[40px] h-[40px] rounded-full flex items-center justify-center bg-[#32CD32]
      text-white text-[15px] shadow-xl font-semibold cursor-pointer"
        >
          {userData.fullName.slice(0, 1)}
        </div>
        {showInfo && (
          <div
            className="fixed top-[80px] right-[10px] md:right-[10%] lg:right-[18%] w-[180px]
        bg-white shadow-2xl rounded-xl p-[20px] flex flex-col gap-[10px] z-[9999]"
          >
            <div className="text-[17px] font-semibold">{userData.fullName}</div>
            {/* This my ORDERS section works for small screen only */}
            {userData.role === "user" && (
              <div className="md:hidden text-[#32CD32] font-semibold cursor-pointer">
                My Orders
              </div>
            )}
            <div
              onClick={logoutHandler}
              className="text-[#32CD32] font-semibold cursor-pointer"
            >
              Log Out
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
