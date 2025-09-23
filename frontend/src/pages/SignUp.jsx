import React from "react";
import logo from "../assets/logo.svg";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useContext, useState } from "react";
import { authDataContext } from "../context/AuthContext.jsx";
import { userDataContext } from "../context/userContext.jsx";

function SignUp({ getPost }) {
  // ✅ getPost prop liya
  let { serverUrl } = useContext(authDataContext);
  let navigate = useNavigate();
  let { setUserData } = useContext(userDataContext);

  let [firstName, setFirstName] = useState("");
  let [lastName, setLastName] = useState("");
  let [userName, setUserName] = useState("");
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let [loading, setLoading] = useState(false);
  let [error, setError] = useState("");

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let result = await axios.post(
        serverUrl + "/api/auth/signup",
        {
          firstName,
          lastName,
          userName,
          email,
          password
        },
        { withCredentials: true }
      );

      setUserData(result.data);

      // ✅ Signup ke baad turant post fetch
      if (typeof getPost === "function") {
        await getPost();
      }

      navigate("/"); // ✅ Navigate hook use kiya (Navigate component nahi)
      setError("");
      setFirstName("");
      setLastName("");
      setUserName("");
      setEmail("");
      setPassword("");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen bg-[white] flex flex-col items-center justify-start gap-[10px]">
      <div className="p-[30px] lg:p-[35px] w-full">
        <img src={logo} className="w-[100px]" alt="Logo" />
      </div>
      <form
        className="w-[90%] max-w-[400px] h-[570px] md:shadow-xl flex flex-col justify-center items-center gap-[15px] mb-[30px]"
        onSubmit={handleSignUp}
      >
        <h1 className="text-gray-800 text-[30px] font-semibold mb-[25px]">
          Sign Up
        </h1>

        <input
          type="text"
          placeholder="First Name"
          required
          className="w-[90%] h-[50px] border-2 border-gray-600 p-[10px] rounded-md"
          onChange={(e) => setFirstName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Last Name"
          required
          className="w-[90%] h-[50px] border-2 border-gray-600 p-[10px] rounded-md"
          onChange={(e) => setLastName(e.target.value)}
        />
        <input
          type="text"
          placeholder="User Name"
          required
          className="w-[90%] h-[50px] border-2 border-gray-600 p-[10px] rounded-md"
          onChange={(e) => setUserName(e.target.value)}
        />
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
          {loading ? "Loading.." : "Sign Up"}
        </button>

        <p>
          Already have an Account?{" "}
          <span
            className=" text-[#24b2ff] cursor-pointer ml-[5px]"
            onClick={() => navigate("/login")}
          >
            Sign In
          </span>
        </p>
      </form>
    </div>
  );
}

export default SignUp;
