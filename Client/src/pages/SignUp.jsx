import React from "react";
import { useState } from "react";
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";

const SignUp = () => {
  // Creating the color variable
  const primaryColor = "#32CD32";
  const hoverColor = "#e64323";
  const bgColor = "#fff9f6";
  const borderColor = "#ddd";

  //Use State Variables
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("user");

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: bgColor }}
    >
      <div
        className={`bg-white rounded-xl shadow-lg w-full max-w-md p-8 border-[1px] border-[${borderColor}]`}
        style={{ border: `1px solid ${borderColor}` }}
      >
        <h1
          className={`text-3xl font-bold mb-2`}
          style={{ color: primaryColor }}
        >
          ChopNow
        </h1>
        <p className="text-gray-600 mb-8">Create your account to get started</p>

        {/* FULLNAME */}
        <div className="mb-4">
          <label
            htmlFor="fullName"
            className="block text-gray-700 font-medium mb-1"
          >
            Full Name
          </label>
          <input
            type="text"
            className="w-full border border-gray-400  rounded-lg px-3 py-2 focus:outline-none 
            focus:border-green-500"
            placeholder="Enter your Full Name"
          />
        </div>

        {/* EMAIL */}
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-gray-700 font-medium mb-1"
          >
            Email
          </label>
          <input
            type="text"
            className="w-full border border-gray-400  rounded-lg px-3 py-2 focus:outline-none 
            focus:border-green-500"
            placeholder="Enter your Email"
          />
        </div>

        {/* MOBILE */}
        <div className="mb-4">
          <label
            htmlFor="mobile"
            className="block text-gray-700 font-medium mb-1"
          >
            Phone Number
          </label>
          <input
            type="tel"
            className="w-full border border-gray-400 rounded-lg px-3 py-2 focus:outline-none 
            focus:border-green-500"
            placeholder="Enter your Full Name"
          />
        </div>

        {/* PASSWORD */}
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-gray-700 font-medium mb-1"
          >
            Password
          </label>
          <div className="relative ">
            <input
              type={`${showPassword ? "text" : "password"}`}
              className="w-full border border-gray-400 rounded-lg px-3 py-2 focus:outline-none 
            focus:border-green-500"
              placeholder="Enter your Password"
            />
            <button
              className="absolute right-3 top-[13px] text-gray-500 cursor-pointer"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {!showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
            </button>
          </div>
        </div>

        {/* ROLE */}
        <div className="mb-4">
          <label
            htmlFor="role"
            className="block text-gray-700 font-medium mb-1"
          >
            Role
          </label>
          <div className="flex gap-2">
            {["user", "owner", "Chop-Rider"].map((r) => (
              <button
                className="flex-1 border border-gray-400 rounded-lg px-2 py-2 text-center font-medium
                transition-colors cursor-pointer"
                onClick={() => setRole(r)}
                style={
                  role == r
                    ? { backgroundColor: primaryColor, color: "white "}
                    : { border: `1px solid ${borderColor}`, color: "#333" }
                }
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
