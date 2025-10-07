import React from "react";
import { useState } from "react";
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { Link } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../firesbase.js";
import { ClipLoader } from "react-spinners";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice.js";

const SignUp = () => {
  // Creating the color variable
  const primaryColor = "#32CD32";
  const hoverColor = "#e64323";
  const bgColor = "#fff9f6";
  const borderColor = "#ddd";

  //Use State Variables
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("user");

  //Registration State Variables
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch()

  //Creating a Function that handles sign up
  const signUpHandler = async () => {
    setLoading(true);
    setErr(null);
    try {
      //Calling axios
      const result = await axios.post(
        `${serverUrl}/api/auth/signup`,
        {
          fullName,
          email,
          mobile,
          password,
          role,
        },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      dispatch(setUserData(result.data))
    } catch (error) {
      setErr(error?.response?.data?.message);
      setLoading(false);
    }
  };

  //Sign Up with GOOGLE AUTH
  const handleGoogleAuth = async () => {
    if (!mobile) {
      return setErr("Phone No is required");
    }
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);

    try {
      const { data } = await axios.post(
        `${serverUrl}/api/auth/google-auth`,
        {
          fullName: result.user.displayName,
          email: result.user.email,
          role,
          mobile,
        },
        { withCredentials: true }
      );
      dispatch(setUserData(data))
      setErr("");
    } catch (error) {
      console.log(error);
      const message =
      error?.response?.data?.message ||
      error?.response?.data || // in case backend sends string
      "Something went wrong during Google signup";
      setErr(message);
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
            onChange={(e) => setFullName(e.target.value)}
            value={fullName}
            type="text"
            className="w-full border border-gray-400  rounded-lg px-3 py-2 focus:outline-none 
            focus:border-green-500"
            placeholder="Enter your Full Name"
            required
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
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            type="text"
            className="w-full border border-gray-400  rounded-lg px-3 py-2 focus:outline-none 
            focus:border-green-500"
            placeholder="Enter your Email"
            required
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
            onChange={(e) => setMobile(e.target.value)}
            value={mobile}
            type="tel"
            className="w-full border border-gray-400 rounded-lg px-3 py-2 focus:outline-none 
            focus:border-green-500"
            placeholder="Enter your Mobile Number"
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
            {["user", "owner", "chopNowRider"].map((r) => (
              <button
                key={r}
                className="flex-1 border border-gray-400 rounded-lg px-2 py-2 text-center font-medium
                transition-colors cursor-pointer"
                onClick={() => setRole(r)}
                style={
                  role == r
                    ? { backgroundColor: primaryColor, color: "white " }
                    : { border: `1px solid ${borderColor}`, color: "#32CD32" }
                }
              >
                {r}
              </button>
            ))}
          </div>
        </div>
        <button
          disabled={loading}
          onClick={signUpHandler}
          className={`w-full font-semibold py-2 rounded-lg transition duration-200 cursor-pointer
        active:bg-white active:text-green-600 bg-[#32CD32] text-white`}
        >
          {loading ? <ClipLoader size={20} /> : "Sign Up"}
        </button>
        {err && <p className="text-red-500 text-center my-[10px]">{err}</p>}

        <button
          onClick={handleGoogleAuth}
          className="w-full mt-4 flex items-center justify-center gap-2 border border-gray-400 rounded-lg
        px-4 py-2 transition duration-200 hover:bg-gray-100 cursor-pointer"
        >
          <FcGoogle size={20} />
          <span>Sign up with Google</span>
        </button>
        <p className="text-center mt-2">
          Already have an account ?{" "}
          <Link to="/signin" className="text-[#32CD32]">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
