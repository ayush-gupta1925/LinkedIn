// ConnectionButton.jsx
import React, { useContext, useState, useEffect } from "react";
import { authDataContext } from "../context/AuthContext.jsx";
import { userDataContext } from "../context/userContext.jsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { socket } from "../context/userContext.jsx"; // use same socket

function ConnectionButton({ userId }) {
  const { serverUrl } = useContext(authDataContext);
  const { userData } = useContext(userDataContext);
  const [status, setStatus] = useState("");
  const navigate = useNavigate();

  const handleSendConnection = async () => {
    try {
      await axios.post(
        `${serverUrl}/api/connection/send/${userId}`,
        {},
        { withCredentials: true }
      );
    } catch (err) {
      console.log(err);
    }
  };

  const handleRemoveConnection = async () => {
    try {
      await axios.delete(`${serverUrl}/api/connection/remove/${userId}`, {
        withCredentials: true
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleGetStatus = async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/connection/getStatus/${userId}`,
        { withCredentials: true }
      );
      setStatus(result.data.status);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (!userData?._id) return;
    socket.emit("register", userData._id);
    handleGetStatus();

    socket.on("statusUpdate", ({ updatedUserId, newStatus }) => {
      if (updatedUserId === userId) {
        setStatus(newStatus);
      }
    });

    return () => {
      socket.off("statusUpdate");
    };
  }, [userId, userData]);

  const handleClick = async () => {
    if (status === "Disconnect") {
      await handleRemoveConnection();
    } else if (status === "Received") {
      navigate("/network");
    } else {
      await handleSendConnection();
    }
  };

  return (
    <button
      className={`min-w-[100px] h-[40px] rounded-full border-2 border-[#2dc0ff] 
    hover:bg-[#2dc0ff] hover:text-white 
    transition-colors duration-300 
    ${
      status === "Pending"
        ? "opacity-50 cursor-not-allowed hover:bg-transparent hover:text-gray-700"
        : ""
    }`}
      onClick={handleClick}
      disabled={status === "Pending"}
    >
      {status || "Connect"}
    </button>
  );
}

export default ConnectionButton;
