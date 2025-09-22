import React from "react";
import { useState } from "react";
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../firesbase";
import { ClipLoader } from "react-spinners";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice.js";

const SignIn = () => {
  // Creating the color variable
  const primaryColor = "#32CD32";
  const hoverColor = "#e64323";
  const bgColor = "#fff9f6";
  const borderColor = "#ddd";

  //Navigation
  const navigate = useNavigate();

  //Use State Variables
  const [showPassword, setShowPassword] = useState(false);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch()

  //Registration State Variables
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  //Creating a Function that handles sign up
  const signInHandler = async () => {
    setLoading(true);
    setErr(null);
    try {
      //Calling axios
      const result = await axios.post(
        `${serverUrl}/api/auth/signin`,
        {
          email,
          password,
        },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      dispatch(setUserData(result.data))
    } catch (error) {
      console.log(error);
      setErr(error?.response?.data?.message);
      setLoading(false);
    }
  };

  //Handle being able to login with google
  const handleGoogleAuth = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);

    try {
      const { data } = await axios.post(
        `${serverUrl}/api/auth/google-auth`,
        { email: result.user.email },
        { withCredentials: true }
      );
      dispatch(setUserData(data))
    } catch (error) {
      console.log(error);
      setErr(error?.response?.data?.message);
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-4"
      style={{ backgroundColor: bgColor }}
    >
      <div
        className={`bg-white rounded-xl shadow-lg w-full max-w-md p-8 border-[1px]`}
        style={{ border: `1px solid ${borderColor}` }}
      >
        <h1
          className={`text-3xl font-bold mb-2`}
          style={{ color: primaryColor }}
        >
          ChopNow
        </h1>
        <p className="text-gray-600 mb-8">Login now and place your order</p>

        {/* EMAIL */}
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-gray-700 font-medium mb-1"
          >
            Email
          </label>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            type="text"
            className="w-full border border-gray-400  rounded-lg px-3 py-2 focus:outline-none 
            focus:border-green-500"
            placeholder="Enter your Email"
            required
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
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type={`${showPassword ? "text" : "password"}`}
              className="w-full border border-gray-400 rounded-lg px-3 py-2 focus:outline-none 
            focus:border-green-500"
              placeholder="Enter your Password"
              required
            />
            <button
              type="button"
              className="absolute right-3 top-[13px] text-gray-500 cursor-pointer"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {!showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
            </button>
          </div>
          <div
            className="text-left mt-2 mb-4 text-[#32CD32] cursor-pointer"
            onClick={() => navigate("/forgot-password")}
          >
            Forgot Password
          </div>
        </div>

        <button
          onClick={signInHandler}
          className={`w-full font-semibold py-2 rounded-lg transition duration-200 cursor-pointer
        active:bg-white active:text-green-600 bg-[#32CD32] text-white`}
          disabled={loading}
        >
          {loading ? <ClipLoader size={20} /> : "Sign In"}
        </button>
        {err && <p className="text-red-500 text-center my-[10px]">{err}</p>}

        <button
          onClick={handleGoogleAuth}
          className="w-full mt-4 flex items-center justify-center gap-2 border border-gray-400 rounded-lg
        px-4 py-2 transition duration-200 hover:bg-gray-100 cursor-pointer"
        >
          <FcGoogle size={20} />
          <span>Sign In with Google</span>
        </button>
        <p className="text-center mt-2">
          Don't have an account ?{" "}
          <Link to="/signup" className="text-[#32CD32]">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
