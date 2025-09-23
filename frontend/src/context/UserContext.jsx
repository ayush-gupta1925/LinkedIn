import React, { useContext, useEffect, useState } from "react";
import { createContext } from "react";
import axios from "axios";
import { authDataContext } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

export const userDataContext = createContext();
export const socket = io("https://linkedin-backend-7kvt.onrender.com", { withCredentials: true });

function UserContext({ children }) {
  let navigate = useNavigate();
  let [userData, setUserData] = useState(null);
  let [edit, setEdit] = useState(false);
  let [postData, setPostData] = useState([]);
  let [profileData, setProfileData] = useState([]);
  let [userConnections, setUserConnections] = useState([]); // 🔹 new state

  let { serverUrl } = useContext(authDataContext);

  // Get logged-in user
  const getCurrentUser = async () => {
    try {
      let result = await axios.get(serverUrl + "/api/user/currentuser", {
        withCredentials: true
      });
      setUserData(result.data);
    } catch (err) {
      console.log(err);
      setUserData(null);
    }
  };

  // Get all posts
  const getPost = async () => {
    try {
      let result = await axios.get(serverUrl + "/api/post/getpost", {
        withCredentials: true
      });
      setPostData(result.data);
    } catch (err) {
      console.log(err.response?.data || err);
    }
  };

  // Get profile
  const handleGetProfile = async (userName) => {
    try {
      let result = await axios.get(
        serverUrl + `/api/user/profile/${userName}`,
        { withCredentials: true }
      );
      setProfileData(result.data);
      navigate("/profile");
    } catch (err) {
      console.log(err);
    }
  };

  // 🔹 Fetch connections
  const fetchUserConnections = async () => {
    try {
      const res = await axios.get(`${serverUrl}/api/connection`, {
        withCredentials: true
      });
      setUserConnections(res.data || []);
    } catch (err) {
      console.error("fetch user connections error:", err);
      setUserConnections([]);
    }
  };

  useEffect(() => {
    getCurrentUser();
    getPost();
    fetchUserConnections();

    socket.on("postCreated", (posts) => setPostData(posts));
    socket.on("postUpdated", (updatedPost) => {
      setPostData((prevPosts) =>
        prevPosts.map((post) =>
          post._id === updatedPost._id ? updatedPost : post
        )
      );
    });
    socket.on("postDeleted", (deletedPostId) => {
      setPostData((prevPosts) =>
        prevPosts.filter((post) => post._id !== deletedPostId)
      );
    });

    return () => {
      socket.off("postCreated");
      socket.off("postUpdated");
      socket.off("postDeleted");
    };
  }, []);

  let value = {
    userData,
    setUserData,
    edit,
    setEdit,
    postData,
    setPostData,
    getPost,
    handleGetProfile,
    profileData,
    setProfileData,
    userConnections, // 🔹 provide
    setUserConnections, // 🔹 provide
    fetchUserConnections // 🔹 provide
  };

  return (
    <userDataContext.Provider value={value}>
      {children}
    </userDataContext.Provider>
  );
}

export default UserContext;
