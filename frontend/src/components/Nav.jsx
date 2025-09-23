// import React, { useContext, useEffect, useState } from "react";
// import logo2 from "../assets/logo2.png";
// import { IoMdHome } from "react-icons/io";
// import { FaSearch } from "react-icons/fa";
// import { FaUsers } from "react-icons/fa";
// import { IoIosNotifications } from "react-icons/io";
// import dp from "../assets/dp.png";
// import axios from "axios";
// import { userDataContext } from "../context/UserContext.jsx";
// import { authDataContext } from "../context/AuthContext.jsx";
// import { socket } from "../context/UserContext.jsx";
// import { Navigate, useNavigate } from "react-router-dom";
// import { BsFillChatTextFill } from "react-icons/bs";
// function Nav() {
//   let { userData, setUserData, handleGetProfile, profileData, setProfileData } =
//     useContext(userDataContext);
//   let [searchInput, setSearchInput] = useState("");
//   let { serverUrl } = useContext(authDataContext);
//   let navigate = useNavigate();
//   let [showPop, setShowPop] = useState(false);
//   let [searchData, setSearchData] = useState([]);
//   const [notificationData, setNotificationData] = useState([]);

//   const [requestsCount, setRequestsCount] = useState(0);

//   // Fetch initial pending requests count
//   const fetchRequestsCount = async () => {
//     try {
//       const res = await fetch(`${serverUrl}/api/connection/requests`, {
//         credentials: "include"
//       });
//       const data = await res.json();
//       setRequestsCount(data.length);
//     } catch (err) {
//       console.error("fetch requests count error:", err);
//     }
//   };

//   useEffect(() => {
//     fetchRequestsCount();

//     // Listen for real-time updates
//     socket.on("statusUpdate", (payload) => {
//       const { updatedUserId, newStatus } = payload;

//       // Agar kisi ne request bheja
//       if (newStatus === "Received") {
//         setRequestsCount((prev) => prev + 1);
//       }

//       // Agar request reject/accept hua
//       if (newStatus === "Disconnect" || newStatus === "Rejected") {
//         setRequestsCount((prev) => Math.max(prev - 1, 0));
//       }
//     });

//     return () => {
//       socket.off("statusUpdate");
//     };
//   }, []);

//   const handleSignOut = async () => {
//     try {
//       let result = await axios.get(serverUrl + "/api/auth/logout", {
//         withCredentials: true
//       });
//       setUserData(null);
//       navigate("/login");
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   const handleSearch = async () => {
//     try {
//       if (!searchInput || searchInput.trim() === "") {
//         setSearchData([]);
//         return; // empty input pe request mat bhejo
//       }

//       let result = await axios.get(
//         `${serverUrl}/api/user/search?query=${encodeURIComponent(searchInput)}`,
//         { withCredentials: true }
//       );

//       setSearchData(result.data);
//     } catch (err) {
//       setSearchData([]);
//       console.log(err);
//     }
//   };

//   const handleGetNotification = async () => {
//     try {
//       const result = await axios.get(serverUrl + "/api/notification/get", {
//         withCredentials: true
//       });
//       setNotificationData(result.data || []);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//     if (searchInput && searchInput.trim() !== "") {
//       handleSearch();
//     } else {
//       setSearchData([]);
//     }
//   }, [searchInput]);

//   useEffect(() => {
//     handleGetNotification();

//     // jab backend se update aata hai
//     socket.on("notification-update", () => {
//       handleGetNotification();
//     });

//     return () => {
//       socket.off("notification-update");
//     };
//   }, []);

//   return (
//     <div className="w-full h-[70px] bg-[#f4f5f1] fixed top-0 shadow-lg flex justify-around items-center left-0 z-[80] ">
//       <div>
//         <img
//           src={logo2}
//           alt="linkedin"
//           className="w-[50px] cursor-pointer"
//           onClick={() => navigate("/")}
//         />
//       </div>
//       <form>
//         <div className="flex border-2 rounded-lg h-[2.7rem] bg-[#e5e6e2]  ">
//           <div
//             className=" pt-[13px] 
//                 ml-[1rem] mr-[1rem]
              
//                 "
//           >
//             <FaSearch />
//           </div>
//           <input
//             type="text"
//             className="h-[2.5rem]
//       lg:w-[450px]
//       md:w-[350px]
//       sm:w-[200px]
//       w-[120px]
//       rounded-lg
     
//     text-base
//     bg-[#e5e6e2]
//       outline-none "
//             placeholder="Search here"
//             value={searchInput}
//             onChange={(e) => setSearchInput(e.target.value)}
//           />
//         </div>
//       </form>

//       {searchData.length > 0 && (
//         <div className="absolute top-[80px] min-h-[100px] left-[15px] lg:left-[13%] sm:left-[10%]  md:left-[10%] shadow-lg w-[380px] md:w-[500px] bg-white rounded-lg ml-[10px] mr-[10px] flex flex-col justify-center items-start pl-[15px] gap-[20px] pt-[10px] pb-[10px]  overflow-auto">
//           {searchData.map((sea) => (
//             <div
//               className="flex w-[95%] justify-center items-center flex-col gap-[10px] border-b-2 border-b-gray-400 pb-[10px] hover:bg-[#b6c0c9] rounded-lg pt-[10px] cursor-pointer"
//               onClick={() => {
//                 handleGetProfile(sea.userName);
//               }}
//             >
//               <div className="flex justify-between items-center w-full   ">
//                 <div className="flex justify-center items-start gap-[10px]">
//                   <div className="rounded-full overflow-hidden flex items-center justify-start relative left-[10px] ">
//                     <img
//                       src={sea.profileImage || dp}
//                       alt=""
//                       className="w-[55px] h-[55px] cursor-pointer rounded-full object-cover"
//                     />
//                   </div>
//                   <div>
//                     <div className="text-[20px] font-semibold text-gray-700 relative  left-[15px]">{`${sea.firstName} ${sea.lastName}`}</div>
//                     <div className="text-[16px] font-semibold text-gray-700 relative  left-[15px]">
//                       {sea.headline}{" "}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       <div className="flex justify-between w-[10rem] sm:w-[25%] md:w-[30%]   lg:w-[40%] relative">
//         {showPop && (
//           <div className="w-[300px] min-h-[300px] bg-white shadow-lg absolute top-[70px] lg:right-[1px]   md:right-[35px] sm:right-[10px] right-[10px] rounded-lg flex flex-col items-center p-[20px] gap-[20px]">
//             <div>
//               <img
//                 src={userData.profileImage || dp}
//                 alt=""
//                 className="w-[60px] h-[60px] cursor-pointer rounded-full object-cover"
//               />
//             </div>
//             <div className="text-[18px] font-semibold text-gray-700 ">{`${userData.firstName} ${userData.lastName}`}</div>
//             <button
//               className="w-[100%] h-[40px] rounded-full border-2 border-[#2dc0ff] hover:bg-[#e6e6e8]"
//               onClick={() => handleGetProfile(userData.userName)}
//             >
//               View Profile
//             </button>
//             <div className="w-full h-[1px] bg-gray-700"></div>

//             <div
//               className="flex cursor-pointer relative items-center"
//               onClick={() => navigate("/network")}
//             >
//               {/* Icon */}
//               <div className="text-2xl mr-2 text-gray-700">
//                 <FaUsers />
//               </div>

//               {/* Label with Badge */}
//               <div className="text-base text-gray-500 relative">
//                 My Networks
//                 {requestsCount > 0 && (
//                   <span className="absolute -top-2 -right-5 bg-blue-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full shadow-md">
//                     {requestsCount}
//                   </span>
//                 )}
//               </div>
//             </div>

//             {/* conversation  */}
//             <div
//               className="flex cursor-pointer"
//               onClick={() => navigate("/conversations")}
//             >
//               <div className="text-2xl flex mr-[1rem] text-gray-700 gap-2">
//                 <BsFillChatTextFill />
//                 <div className="text-base text-gray-500"> My Conversation</div>
//               </div>
//             </div>

//             <button
//               className="w-[100%] h-[40px] rounded-full border-2 border-[#f15353] text-[#f15353] hover:bg-[#f0e6e6]"
//               onClick={handleSignOut}
//             >
//               Sign Out
//             </button>
//           </div>
//         )}

//         <div
//           className="lg:flex flex-col hidden cursor-pointer"
//           onClick={() => navigate("/")}
//         >
//           <div className="text-2xl flex-col pl-[.5rem] text-gray-700">
//             <IoMdHome />
//           </div>
//           <div className="text-base text-gray-500"> Home</div>
//         </div>

//         <div
//           className="cursor-pointer md:flex flex-col  hidden items-center relative"
//           onClick={() => navigate("/network")}
//         >
//           {/* Icon */}
//           <div className="text-4xl lg:text-2xl md:text-2xl relative">
//             <FaUsers />

//             {/* Badge */}
//             {requestsCount > 0 && (
//               <span className="absolute -top-2 -right-6 bg-blue-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full shadow-md">
//                 {requestsCount}
//               </span>
//             )}
//           </div>

//           {/* Label */}
//           <div className="text-base text-gray-500 text-center">My Networks</div>
//         </div>

//         <div
//           className="cursor-pointer relative"
//           onClick={() => navigate("/notification")}
//         >
//           {/* Icon */}
//           <div className="lg:text-2xl md:text-2xl sm:text-4xl text-4xl pl-[1.5rem] text-gray-700 relative">
//             <IoIosNotifications />

//             {/* Badge */}
//             {/* Badge */}
//             {notificationData.length > 0 && (
//               <span className="absolute -top-2 -right-2 sm:right-0 md:right-4 lg:right-4 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full shadow-md">
//                 {notificationData.length}
//               </span>
//             )}
//           </div>

//           {/* Label */}
//           <div className="text-base text-gray-500 hidden md:block text-center">
//             Notification
//           </div>
//         </div>

//         <div
//           onClick={() => {
//             setShowPop((prev) => !prev);
//           }}
//           className="cursor-pointer"
//         >
//           <img
//             src={userData.profileImage || dp}
//             alt=""
//             className="w-[45px] h-[45px] cursor-pointer rounded-full object-cover"
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Nav;






import React, { useContext, useEffect, useState } from "react";
import logo2 from "../assets/logo2.png";
import { IoMdHome } from "react-icons/io";
import { FaSearch, FaUsers } from "react-icons/fa";
import { IoIosNotifications } from "react-icons/io";
import dp from "../assets/dp.png";
import axios from "axios";
import { userDataContext } from "../context/UserContext.jsx";
import { authDataContext } from "../context/AuthContext.jsx";
import { socket } from "../context/UserContext.jsx";
import { useNavigate } from "react-router-dom";
import { BsFillChatTextFill } from "react-icons/bs";

function Nav() {
  let { userData, handleGetProfile } = useContext(userDataContext);
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
      const { newStatus } = payload;
      if (newStatus === "Received") setRequestsCount((prev) => prev + 1);
      if (newStatus === "Disconnect" || newStatus === "Rejected")
        setRequestsCount((prev) => Math.max(prev - 1, 0));
    });

    return () => socket.off("statusUpdate");
  }, []);

  const handleSignOut = async () => {
    try {
      await axios.get(serverUrl + "/api/auth/logout", { withCredentials: true });
      navigate("/login");
    } catch (err) {
      console.log(err);
    }
  };

  const handleSearch = async () => {
    try {
      if (!searchInput || searchInput.trim() === "") {
        setSearchData([]);
        return;
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

  useEffect(() => {
    if (searchInput && searchInput.trim() !== "") handleSearch();
    else setSearchData([]);
  }, [searchInput]);

  return (
    <div className="w-full bg-[#f4f5f1] fixed top-0 left-0 z-[80] shadow-lg flex justify-between items-center h-[70px] px-4 sm:px-8">
      {/* Logo */}
      <div className="flex items-center">
        <img
          src={logo2}
          alt="linkedin"
          className="w-[40px] sm:w-[50px] cursor-pointer"
          onClick={() => navigate("/")}
        />
      </div>

      {/* Search */}
      <div className="flex-1 mx-2 sm:mx-4 relative">
        <div className="flex items-center border-2 rounded-lg h-[2.5rem] sm:h-[2.7rem] bg-[#e5e6e2] px-2 sm:px-4">
          <FaSearch className="text-sm sm:text-base" />
          <input
            type="text"
            className="flex-1 h-full bg-[#e5e6e2] outline-none text-sm sm:text-base ml-2"
            placeholder="Search here"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>

        {searchData.length > 0 && (
          <div className="absolute top-[2.8rem] sm:top-[3.2rem] left-0 w-[250px] sm:w-[500px] max-h-[300px] overflow-auto bg-white rounded-lg shadow-lg z-[90] p-2 sm:p-4">
            {searchData.map((sea) => (
              <div
                key={sea._id}
                className="flex items-center gap-2 sm:gap-4 p-2 sm:p-3 border-b last:border-b-0 hover:bg-[#b6c0c9] cursor-pointer rounded-md"
                onClick={() => handleGetProfile(sea.userName)}
              >
                <img
                  src={sea.profileImage || dp}
                  alt=""
                  className="w-[35px] sm:w-[55px] h-[35px] sm:h-[55px] rounded-full object-cover"
                />
                <div className="flex flex-col">
                  <span className="text-sm sm:text-[20px] font-semibold text-gray-700">{`${sea.firstName} ${sea.lastName}`}</span>
                  <span className="text-xs sm:text-[16px] text-gray-600">{sea.headline}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right icons */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Home */}
        <div
          className="flex flex-col items-center cursor-pointer text-gray-700"
          onClick={() => navigate("/")}
        >
          <IoMdHome className="text-xl sm:text-2xl" />
          <span className="text-xs sm:text-base">Home</span>
        </div>

        {/* Network */}
        <div
          className="flex flex-col items-center cursor-pointer relative text-gray-700"
          onClick={() => navigate("/network")}
        >
          <FaUsers className="text-xl sm:text-2xl" />
          {requestsCount > 0 && (
            <span className="absolute -top-1 -right-2 sm:-top-2 sm:-right-3 bg-blue-500 text-white text-[10px] sm:text-xs font-bold px-1.5 py-0.5 rounded-full shadow-md">
              {requestsCount}
            </span>
          )}
          <span className="text-xs sm:text-base">My Network</span>
        </div>

        {/* Notifications */}
        <div
          className="flex flex-col items-center cursor-pointer relative text-gray-700"
          onClick={() => navigate("/notification")}
        >
          <IoIosNotifications className="text-xl sm:text-2xl" />
          {notificationData.length > 0 && (
            <span className="absolute -top-1 -right-2 sm:-top-2 sm:-right-3 bg-red-500 text-white text-[10px] sm:text-xs font-bold px-1.5 py-0.5 rounded-full shadow-md">
              {notificationData.length}
            </span>
          )}
          <span className="text-xs sm:text-base">Notification</span>
        </div>

        {/* Profile */}
        <div className="relative">
          <img
            src={userData.profileImage || dp}
            alt=""
            className="w-8 h-8 sm:w-[45px] sm:h-[45px] rounded-full cursor-pointer"
            onClick={() => setShowPop((prev) => !prev)}
          />
          {showPop && (
            <div className="absolute right-0 top-[50px] w-[250px] sm:w-[300px] bg-white shadow-lg rounded-lg p-3 flex flex-col gap-3 z-[100]">
              <img
                src={userData.profileImage || dp}
                alt=""
                className="w-12 h-12 sm:w-16 sm:h-16 rounded-full mx-auto"
              />
              <div className="text-center font-semibold text-gray-700 text-sm sm:text-base">{`${userData.firstName} ${userData.lastName}`}</div>
              <button
                className="w-full h-8 sm:h-10 rounded-full border-2 border-[#2dc0ff] hover:bg-[#e6e6e8]"
                onClick={() => handleGetProfile(userData.userName)}
              >
                View Profile
              </button>
              <div className="w-full h-[1px] bg-gray-300"></div>
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => navigate("/network")}
              >
                <FaUsers />
                <span className="text-xs sm:text-base">My Network</span>
              </div>
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => navigate("/conversations")}
              >
                <BsFillChatTextFill />
                <span className="text-xs sm:text-base">My Conversation</span>
              </div>
              <button
                className="w-full h-8 sm:h-10 rounded-full border-2 border-[#f15353] text-[#f15353] hover:bg-[#f0e6e6]"
                onClick={handleSignOut}
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Nav;

