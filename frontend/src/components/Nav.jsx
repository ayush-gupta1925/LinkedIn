import React, { useContext, useEffect, useState } from "react";
import logo2 from "../assets/logo2.png";
import { IoMdHome } from "react-icons/io";
import { FaSearch } from "react-icons/fa";
import { FaUsers } from "react-icons/fa";
import { IoIosNotifications } from "react-icons/io";
import dp from "../assets/dp.png";
import axios from "axios";
import { userDataContext } from "../context/userContext.jsx";
import { authDataContext } from "../context/AuthContext.jsx";
import { socket } from "../context/userContext.jsx";
import { Navigate, useNavigate } from "react-router-dom";
import { BsFillChatTextFill } from "react-icons/bs";
function Nav() {
  let { userData, setUserData, handleGetProfile, profileData, setProfileData } =
    useContext(userDataContext);
  let [searchInput, setSearchInput] = useState("");
  let { serverUrl } = useContext(authDataContext);
  let navigate = useNavigate();
  let [showPop, setShowPop] = useState(false);
  let [searchData, setSearchData] = useState([]);
  const [notificationData, setNotificationData] = useState([]);

  const [requestsCount, setRequestsCount] = useState(0);

  // Fetch initial pending requests count
  const fetchRequestsCount = async () => {
    try {
      const res = await fetch(`${serverUrl}/api/connection/requests`, {
        credentials: "include"
      });
      const data = await res.json();
      setRequestsCount(data.length);
    } catch (err) {
      console.error("fetch requests count error:", err);
    }
  };

  useEffect(() => {
    fetchRequestsCount();

    // Listen for real-time updates
    socket.on("statusUpdate", (payload) => {
      const { updatedUserId, newStatus } = payload;

      // Agar kisi ne request bheja
      if (newStatus === "Received") {
        setRequestsCount((prev) => prev + 1);
      }

      // Agar request reject/accept hua
      if (newStatus === "Disconnect" || newStatus === "Rejected") {
        setRequestsCount((prev) => Math.max(prev - 1, 0));
      }
    });

    return () => {
      socket.off("statusUpdate");
    };
  }, []);

  const handleSignOut = async () => {
    try {
      let result = await axios.get(serverUrl + "/api/auth/logout", {
        withCredentials: true
      });
      setUserData(null);
      navigate("/login");
    } catch (err) {
      console.log(err);
    }
  };

  const handleSearch = async () => {
    try {
      if (!searchInput || searchInput.trim() === "") {
        setSearchData([]);
        return; // empty input pe request mat bhejo
      }

      let result = await axios.get(
        `${serverUrl}/api/user/search?query=${encodeURIComponent(searchInput)}`,
        { withCredentials: true }
      );

      setSearchData(result.data);
    } catch (err) {
      setSearchData([]);
      console.log(err);
    }
  };

  const handleGetNotification = async () => {
    try {
      const result = await axios.get(serverUrl + "/api/notification/get", {
        withCredentials: true
      });
      setNotificationData(result.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (searchInput && searchInput.trim() !== "") {
      handleSearch();
    } else {
      setSearchData([]);
    }
  }, [searchInput]);

  useEffect(() => {
    handleGetNotification();

    // jab backend se update aata hai
    socket.on("notification-update", () => {
      handleGetNotification();
    });

    return () => {
      socket.off("notification-update");
    };
  }, []);

  return (
    <div className="w-full h-[70px] bg-[#f4f5f1] fixed top-0 shadow-lg flex justify-around items-center left-0 z-[80] ">
      <div>
        <img
          src={logo2}
          alt="linkedin"
          className="w-[50px] cursor-pointer"
          onClick={() => navigate("/")}
        />
      </div>
      <form>
        <div className="flex border-2 rounded-lg h-[2.7rem] bg-[#e5e6e2]  ">
          <div
            className=" pt-[13px] 
                ml-[1rem] mr-[1rem]
              
                "
          >
            <FaSearch />
          </div>
          <input
            type="text"
            className="h-[2.5rem]
      lg:w-[450px]
      md:w-[350px]
      sm:w-[200px]
      w-[120px]
      rounded-lg
     
    text-base
    bg-[#e5e6e2]
      outline-none "
            placeholder="Search here"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
      </form>

      {searchData.length > 0 && (
        <div className="absolute top-[80px] min-h-[100px] left-[15px] lg:left-[13%] sm:left-[10%]  md:left-[10%] shadow-lg w-[380px] md:w-[500px] bg-white rounded-lg ml-[10px] mr-[10px] flex flex-col justify-center items-start pl-[15px] gap-[20px] pt-[10px] pb-[10px]  overflow-auto">
          {searchData.map((sea) => (
            <div
              className="flex w-[95%] justify-center items-center flex-col gap-[10px] border-b-2 border-b-gray-400 pb-[10px] hover:bg-[#b6c0c9] rounded-lg pt-[10px] cursor-pointer"
              onClick={() => {
                handleGetProfile(sea.userName);
              }}
            >
              <div className="flex justify-between items-center w-full   ">
                <div className="flex justify-center items-start gap-[10px]">
                  <div className="rounded-full overflow-hidden flex items-center justify-start relative left-[10px] ">
                    <img
                      src={sea.profileImage || dp}
                      alt=""
                      className="w-[55px] h-[55px] cursor-pointer rounded-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="text-[20px] font-semibold text-gray-700 relative  left-[15px]">{`${sea.firstName} ${sea.lastName}`}</div>
                    <div className="text-[16px] font-semibold text-gray-700 relative  left-[15px]">
                      {sea.headline}{" "}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-between w-[10rem] sm:w-[25%] md:w-[30%]   lg:w-[40%] relative">
        {showPop && (
          <div className="w-[300px] min-h-[300px] bg-white shadow-lg absolute top-[70px] lg:right-[1px]   md:right-[35px] sm:right-[10px] right-[10px] rounded-lg flex flex-col items-center p-[20px] gap-[20px]">
            <div>
              <img
                src={userData.profileImage || dp}
                alt=""
                className="w-[60px] h-[60px] cursor-pointer rounded-full object-cover"
              />
            </div>
            <div className="text-[18px] font-semibold text-gray-700 ">{`${userData.firstName} ${userData.lastName}`}</div>
            <button
              className="w-[100%] h-[40px] rounded-full border-2 border-[#2dc0ff] hover:bg-[#e6e6e8]"
              onClick={() => handleGetProfile(userData.userName)}
            >
              View Profile
            </button>
            <div className="w-full h-[1px] bg-gray-700"></div>

            <div
              className="flex cursor-pointer relative items-center"
              onClick={() => navigate("/network")}
            >
              {/* Icon */}
              <div className="text-2xl mr-2 text-gray-700">
                <FaUsers />
              </div>

              {/* Label with Badge */}
              <div className="text-base text-gray-500 relative">
                My Networks
                {requestsCount > 0 && (
                  <span className="absolute -top-2 -right-5 bg-blue-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full shadow-md">
                    {requestsCount}
                  </span>
                )}
              </div>
            </div>

            {/* conversation  */}
            <div
              className="flex cursor-pointer"
              onClick={() => navigate("/conversations")}
            >
              <div className="text-2xl flex mr-[1rem] text-gray-700 gap-2">
                <BsFillChatTextFill />
                <div className="text-base text-gray-500"> My Conversation</div>
              </div>
            </div>

            <button
              className="w-[100%] h-[40px] rounded-full border-2 border-[#f15353] text-[#f15353] hover:bg-[#f0e6e6]"
              onClick={handleSignOut}
            >
              Sign Out
            </button>
          </div>
        )}

        <div
          className="lg:flex flex-col hidden cursor-pointer"
          onClick={() => navigate("/")}
        >
          <div className="text-2xl flex-col pl-[.5rem] text-gray-700">
            <IoMdHome />
          </div>
          <div className="text-base text-gray-500"> Home</div>
        </div>

        <div
          className="cursor-pointer md:flex flex-col  hidden items-center relative"
          onClick={() => navigate("/network")}
        >
          {/* Icon */}
          <div className="text-4xl lg:text-2xl md:text-2xl relative">
            <FaUsers />

            {/* Badge */}
            {requestsCount > 0 && (
              <span className="absolute -top-2 -right-6 bg-blue-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full shadow-md">
                {requestsCount}
              </span>
            )}
          </div>

          {/* Label */}
          <div className="text-base text-gray-500 text-center">My Networks</div>
        </div>

        <div
          className="cursor-pointer relative"
          onClick={() => navigate("/notification")}
        >
          {/* Icon */}
          <div className="lg:text-2xl md:text-2xl sm:text-4xl text-4xl pl-[1.5rem] text-gray-700 relative">
            <IoIosNotifications />

            {/* Badge */}
            {/* Badge */}
            {notificationData.length > 0 && (
              <span className="absolute -top-2 -right-2 sm:right-0 md:right-4 lg:right-4 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full shadow-md">
                {notificationData.length}
              </span>
            )}
          </div>

          {/* Label */}
          <div className="text-base text-gray-500 hidden md:block text-center">
            Notification
          </div>
        </div>

        <div
          onClick={() => {
            setShowPop((prev) => !prev);
          }}
          className="cursor-pointer"
        >
          <img
            src={userData.profileImage || dp}
            alt=""
            className="w-[45px] h-[45px] cursor-pointer rounded-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}

export default Nav;
