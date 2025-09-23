import React, { useContext, useState } from "react";
import logo from "../assets/logo.svg";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { authDataContext } from "../context/AuthContext";
import { userDataContext } from "../context/userContext";


function Login() {
  let { serverUrl } = useContext(authDataContext);
  let navigate = useNavigate();

  let { setUserData } = useContext(userDataContext);
  let { getPost } = useContext(userDataContext); // <-- getPost from context

  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let [loading, setLoading] = useState(false);
  let [error, setError] = useState("");

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let result = await axios.post(
        serverUrl + "/api/auth/login",
        { email, password },
        { withCredentials: true }
      );

      // Set user data globally
      setUserData(result.data);

      // 🔹 Turant posts fetch karo
      await getPost();

      // Redirect to home
      navigate("/");

      setLoading(false);
      setError("");
      setEmail("");
      setPassword("");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen bg-[white] flex flex-col items-center justify-start gap-[10px]">
      <div className="p-[30px] lg:p-[35px] w-full">
        <img src={logo} className="w-[100px]" alt="Logo" />
      </div>
      <form
        className="w-[90%] max-w-[400px] h-[420px] md:shadow-xl flex flex-col justify-center items-center gap-[15px]"
        onSubmit={handleSignIn}
      >
        <h1 className="text-gray-800 text-[30px] font-semibold mb-[25px]">Sign In</h1>

        <input
          type="email"
          placeholder="Email"
          required
          className="w-[90%] h-[50px] border-2 border-gray-600 p-[10px] rounded-md"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          required
          className="w-[90%] h-[50px] border-2 border-gray-600 p-[10px] rounded-md mb-[20px]"
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && (
          <b>
            <p className="text-red-600 mb-[4px] mt-[-15px]">*{error}</p>
          </b>
        )}

        <button
          className="text-white w-[90%] h-[50px] rounded-full bg-[#1dc9fd]"
          disabled={loading}
        >
          {loading ? "Loading.." : "Sign In"}
        </button>

        <p>
          Don’t have an Account?
          <span
            className="text-[#24b2ff] cursor-pointer ml-[5px]"
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </span>
        </p>

        <button
          onClick={() => navigate("/forgot-password")}
          className="mt-1 text-[#24b2ff] hover:underline font-medium transition duration-200"
        >
          Forgot Password?
        </button>
      </form>
    </div>
  );
}

export default Login;
