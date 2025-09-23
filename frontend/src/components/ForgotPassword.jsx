import React, { useState } from "react";
import axios from "axios";
import { useContext, useRef } from "react";
import logo from "../assets/logo.svg";
import { Navigate, useNavigate } from "react-router-dom";
import { authDataContext } from "../context/AuthContext.jsx";
function ForgotPassword() {
  const [step, setStep] = useState(1);
  let navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  let { serverUrl } = useContext(authDataContext);
  const handleSendOtp = async () => {
    try {
      const res = await axios.post(serverUrl + "/api/auth/forgot-password", {
        email
      });
      setMessage(res.data.message);
      setStep(2);
    } catch (err) {
      setMessage(err.response.data.message);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const res = await axios.post(serverUrl + "/api/auth/verify-otp", {
        email,
        otp
      });
      setMessage(res.data.message);
      setStep(3);
    } catch (err) {
      setMessage(err.response.data.message);
    }
  };

  const handleResetPassword = async () => {
    try {
      const res = await axios.post(serverUrl + "/api/auth/reset-password", {
        email,
        otp,
        newPassword
      });
      setMessage(res.data.message);
      navigate("/");
    } catch (err) {
      setMessage(err.response.data.message);
    }
  };

  return (
    <div className="w-full h-screen bg-[white] flex flex-col items-center justify-start gap-[10px]">
      {/* Logo Section */}
      <div className="p-[30px] lg:p-[35px] w-full">
        <img src={logo} className="w-[100px]" alt="Logo" />
      </div>

      {/* Form Container */}
      <div className="w-[90%] max-w-[400px] min-h-[350px] md:shadow-xl rounded-lg p-6 flex flex-col justify-center items-center gap-[15px]">
        <h1 className="text-gray-800 text-[26px] font-semibold mb-[15px]">
          Forgot Password
        </h1>
        {message && <p className="text-red-500 font-medium">{message}</p>}

        {/* Step 1: Enter Email */}
        {step === 1 && (
          <>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-[90%] h-[50px] border-2 border-gray-400 p-[10px] rounded-md focus:border-[#1dc9fd] outline-none shadow-sm"
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              className="text-white w-[90%] h-[50px] rounded-full bg-[#1dc9fd] hover:bg-[#14b8e6] transition-all shadow-md"
              onClick={handleSendOtp}
            >
              Send OTP
            </button>
          </>
        )}

        {/* Step 2: Verify OTP */}
        {step === 2 && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              className="w-[90%] h-[50px] border-2 border-gray-400 p-[10px] rounded-md focus:border-[#1dc9fd] outline-none shadow-sm"
              onChange={(e) => setOtp(e.target.value)}
            />
            <button
              className="text-white w-[90%] h-[50px] rounded-full bg-green-500 hover:bg-green-600 transition-all shadow-md"
              onClick={handleVerifyOtp}
            >
              Verify OTP
            </button>
          </>
        )}

        {/* Step 3: Reset Password */}
        {step === 3 && (
          <>
            <input
              type="password"
              placeholder="Enter new password"
              className="w-[90%] h-[50px] border-2 border-gray-400 p-[10px] rounded-md focus:border-[#1dc9fd] outline-none shadow-sm"
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button
              className="text-white w-[90%] h-[50px] rounded-full bg-purple-500 hover:bg-purple-600 transition-all shadow-md"
              onClick={handleResetPassword}
            >
              Reset Password
            </button>
          </>
        )}

        {/* Back to Login */}
        <p className="mt-4 text-gray-600 text-sm">
          Remembered your password?
          <span
            className="text-[#24b2ff] cursor-pointer ml-[5px] hover:underline"
            onClick={() => navigate("/login")}
          >
            Sign In
          </span>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;
