import React from "react";
import { useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";
import { ClipLoader } from "react-spinners";

const ForgotPassword = () => {
  //Navigation
  const navigate = useNavigate();

  // Use State Variables..
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  //This functions will handle Forgot Password
  const handleSendOtp = async () => {
    setLoading(true);
    setErr(null);
    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/send-otp`,
        { email },
        { withCredentials: true }
      );
      console.log(result);
      setStep(2);
    } catch (error) {
      console.error(error.response?.data || error.message);
      setErr(error?.response?.data?.message);
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    setErr(null);
    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/verify-otp`,
        { email, otp },
        { withCredentials: true }
      );
      console.log(result);
      setStep(3);
    } catch (error) {
      console.error(error.response?.data || error.message);
      setErr(error?.response?.data?.message);
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    //Check if password is = to confirm password
    setLoading(true);
    setErr(null);
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/reset-password`,
        { email, newPassword },
        { withCredentials: true }
      );

      console.log(result);
      navigate("/signin");
    } catch (error) {
      console.error(error.response?.data || error.message);
      setErr(error?.response?.data?.message);
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full items-center justify-center min-h-screen p-4 bg-[#fff9f6]">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-8">
        <div className="flex items-center gap-4 mb-4">
          <IoIosArrowRoundBack
            onClick={() => navigate("/signin")}
            size={35}
            className="text-[#32CD32] cursor-pointer"
          />
          <h1 className="text-3xl font-bold text-center text-[#32CD32]">
            Forgot Password
          </h1>
        </div>
        {/* ---------- STEP 1 TO RESET PASSWORD ---------- */}
        {step === 1 && (
          <div>
            <div className="mb-4 ">
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
                className="w-full border-[1px] border-gray-400  rounded-lg px-3 py-2 focus:outline-none 
            focus:border-green-500"
                placeholder="Enter your Email"
                required
              />
            </div>

            {/* Send Otp BUTTON */}
            <button
              onClick={handleSendOtp}
              className={`w-full font-semibold py-2 rounded-lg transition duration-200 cursor-pointer
        active:bg-white active:text-green-600 bg-[#32CD32] text-white`}
              disabled={loading}
            >
              {loading ? <ClipLoader size={20} /> : "Send Otp"}
            </button>
            {err && <p className="text-red-500 text-center my-[10px]">{err}</p>}
          </div>
        )}

        {/* ---------- STEP 2 TO RESET PASSWORD ---------- */}
        {step === 2 && (
          <div>
            <div className="mb-4 ">
              <label
                htmlFor="otp"
                className="block text-gray-700 font-medium mb-1"
              >
                Enter OTP
              </label>
              <input
                onChange={(e) => setOtp(e.target.value)}
                value={otp}
                type="text"
                className="w-full border-[1px] border-gray-400  rounded-lg px-3 py-2 focus:outline-none 
            focus:border-green-500"
                placeholder="Enter Otp"
                required
              />
            </div>

            {/* VERIFY OTP BUTTON */}
            <button
              onClick={handleVerifyOtp}
              className={`w-full font-semibold py-2 rounded-lg transition duration-200 cursor-pointer
        active:bg-white active:text-green-600 bg-[#32CD32] text-white`}
              disabled={loading}
            >
              {loading ? <ClipLoader size={20} /> : "Verify"}
            </button>
            {err && <p className="text-red-500 text-center my-[10px]">{err}</p>}
          </div>
        )}

        {/* ---------- STEP 3 TO RESET PASSWORD ---------- */}
        {step === 3 && (
          <div>
            <div className="mb-4 ">
              <label
                htmlFor="newpassword"
                className="block text-gray-700 font-medium mb-1"
              >
                New Password
              </label>
              <input
                onChange={(e) => setNewPassword(e.target.value)}
                value={newPassword}
                type="password"
                className="w-full border-[1px] border-gray-400  rounded-lg px-3 py-2 focus:outline-none 
            focus:border-green-500"
                placeholder="Enter New password"
                required
              />
            </div>
            {/* confirm the password */}
            <div className="mb-4 ">
              <label
                htmlFor="confirmPassword"
                className="block text-gray-700 font-medium mb-1"
              >
                Confirm Password
              </label>
              <input
                onChange={(e) => setConfirmPassword(e.target.value)}
                value={confirmPassword}
                type="password"
                className="w-full border-[1px] border-gray-400  rounded-lg px-3 py-2 focus:outline-none 
            focus:border-green-500"
                placeholder="Confirm Password"
                required
              />
            </div>

            {/* PASSWORD RESET BUTTON */}
            <button
              onClick={handlePasswordReset}
              className={`w-full font-semibold py-2 rounded-lg transition duration-200 cursor-pointer
        active:bg-white active:text-green-600 bg-[#32CD32] text-white mt-2`}
              disabled={loading}
            >
              {loading ? <ClipLoader size={20} /> : "Reset Password"}
            </button>
            {err && <p className="text-red-500 text-center my-[10px]">{err}</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
