// import React, { useContext, useEffect, useState } from "react";
// import Nav from "../components/Nav.jsx";
// import { authDataContext } from "../context/AuthContext.jsx";
// import { userDataContext } from "../context/UserContext.jsx";
// import dp from "../assets/dp.png";
// import axios from "axios";
// import { RxCross2 } from "react-icons/rx";
// export default function Notification() {
//   const { serverUrl } = useContext(authDataContext);
//   const { handleGetProfile } = useContext(userDataContext);

//   const [notificationData, setNotificationData] = useState([]);
//   const [expanded, setExpanded] = useState({}); // track which descriptions are expanded

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

//   const handledeleteOneNotification = async (id) => {
//     try {
//       const result = await axios.delete(
//         serverUrl + `/api/notification/deleteone/${id}`,
//         {
//           withCredentials: true
//         }
//       );
//       await handleGetNotification();
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handledeleteAllNotification = async () => {
//     try {
//       const result = await axios.delete(serverUrl + "/api/notification", {
//         withCredentials: true
//       });
//       await handleGetNotification();
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   function handleMessage(type) {
//     if (type === "like") return "Liked your post";
//     if (type === "comment") return "Commented on your post";
//     return "Accepted your connection";
//   }

//   useEffect(() => {
//     handleGetNotification();
//   }, []);

//   const toggleExpand = (id) => {
//     setExpanded((s) => ({ ...s, [id]: !s[id] }));
//   };

//   return (
//     <div className="w-screen min-h-screen bg-[#f0efe7] pt-[100px] px-4 md:px-8 flex flex-col items-center gap-4">
//       <Nav />

//       {/* Header + Clear All */}
//       <div className="w-full max-w-[900px] shadow-lg rounded-lg p-4 text-lg text-gray-700 bg-white flex items-center justify-between">
//         <div className="text-[22px]">
//           Notifications (
//           <span className="font-bold">{notificationData.length}</span>)
//         </div>

//         {notificationData.length > 0 && (
//           <div
//             className="w-[100px] h-[40px] rounded-full border-2 border-[#a8abdf] text-[#2dc0ff] flex justify-center items-center hover:bg-[#ade6e4] hover:text-[#7a0cf7] transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer text-[17px]"
//             onClick={handledeleteAllNotification}
//           >
//             Clear All
//           </div>
//         )}
//       </div>

//       {/* Notifications List */}
//       {notificationData.length > 0 ? (
//         <div className="w-full max-w-[900px] flex flex-col gap-4">
//           {notificationData.map((noti, index) => {
//             const id = noti._id || index;
//             const relatedUser = noti.relatedUser || {};
//             const post = noti.relatedPost;

//             return (
//               <div
//                 key={id}
//                 className="w-full bg-white shadow rounded-lg p-4 inline-block gap-4 items-start hover:shadow-md transition-shadow relative"
//               >
//                 {/* Left: Avatar + Info */}
//                 <div
//                   className="flex items-start gap-3 flex-1"
//                   onClick={() => handleGetProfile(relatedUser.userName)}
//                 >
//                   <img
//                     src={relatedUser.profileImage || dp}
//                     alt={`${relatedUser.firstName || "User"} avatar`}
//                     className="w-16 h-16 rounded-full object-cover flex-shrink-0 shadow-sm"
//                   />

//                   <div className="flex-1 min-w-0">
//                     {/* Name + Date */}
//                     <div className="flex items-center justify-between gap-2 relative">
//                       <div className="text-[18px] font-semibold text-gray-800 truncate">
//                         {`${relatedUser.firstName || ""} ${
//                           relatedUser.lastName || ""
//                         }`}
//                       </div>
//                       <div className="text-sm text-gray-500 relative top-0 right-10">
//                         {new Date(
//                           noti.createdAt || Date.now()
//                         ).toLocaleString()}
//                       </div>
//                     </div>

//                     {/* Notification message */}
//                     <div className="text-sm text-[#147ce5] font-medium mt-1">
//                       {handleMessage(noti.type)}
//                     </div>

//                     {/* Description + Image */}
//                     <div className="flex gap-8 mt-8 relative ">
//                       {post?.image && (
//                         <div className="w-[100px] h-[100px] flex-shrink-0 rounded overflow-hidden bg-gray-50">
//                           <img
//                             src={post.image}
//                             alt="Post thumbnail"
//                             className="w-full h-full object-cover"
//                           />
//                         </div>
//                       )}
//                       <div className="w-[70%]">
//                         {post && (
//                           <div className="flex-1 border-l-4 border-r-4 rounded-lg bg-gray-50 p-3">
//                             <div
//                               className={`break-words whitespace-pre-wrap ${
//                                 expanded[id] ? "" : "line-clamp-3"
//                               }`}
//                               style={{
//                                 maxHeight: expanded[id] ? "none" : "4.5em",
//                                 overflow: expanded[id] ? "visible" : "hidden"
//                               }}
//                             >
//                               {post.description || ""}
//                             </div>

//                             {post.description &&
//                               post.description.length > 160 && (
//                                 <button
//                                   onClick={(e) => {
//                                     e.stopPropagation();
//                                     toggleExpand(id);
//                                   }}
//                                   className="mt-2 text-sm font-medium text-blue-600 hover:underline"
//                                 >
//                                   {expanded[id] ? "Show less" : "Read more"}
//                                 </button>
//                               )}
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Close Button */}
//                 <RxCross2
//                   className="absolute top-4 right-3 text-2xl text-gray-800 font-bold cursor-pointer hover:text-red-500"
//                   onClick={() => handledeleteOneNotification(id)}
//                 />
//               </div>
//             );
//           })}
//         </div>
//       ) : (
//         <div className="w-full max-w-[900px] bg-white shadow rounded-lg p-6 text-center text-gray-600">
//           No notifications yet
//         </div>
//       )}
//     </div>
//   );
// }


import React, { useContext, useEffect, useState } from "react";
import Nav from "../components/Nav.jsx";
import { authDataContext } from "../context/AuthContext.jsx";
import { userDataContext } from "../context/UserContext.jsx";
import dp from "../assets/dp.png";
import axios from "axios";
import { RxCross2 } from "react-icons/rx";

export default function Notification() {
  const { serverUrl } = useContext(authDataContext);
  const { handleGetProfile } = useContext(userDataContext);

  const [notificationData, setNotificationData] = useState([]);
  const [expanded, setExpanded] = useState({}); // track which descriptions are expanded

  const handleGetNotification = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/notification/get?ts=${Date.now()}`, {
        withCredentials: true,
      });
      setNotificationData(result.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handledeleteOneNotification = async (id) => {
    try {
      await axios.delete(`${serverUrl}/api/notification/deleteone/${id}`, {
        withCredentials: true,
      });
      await handleGetNotification();
    } catch (err) {
      console.error(err);
    }
  };

  const handledeleteAllNotification = async () => {
    try {
      await axios.delete(`${serverUrl}/api/notification`, {
        withCredentials: true,
      });
      await handleGetNotification();
    } catch (err) {
      console.error(err);
    }
  };

  const handleMessage = (type) => {
    if (type === "like") return "Liked your post";
    if (type === "comment") return "Commented on your post";
    return "Accepted your connection";
  };

  useEffect(() => {
    handleGetNotification();
  }, []);

  const toggleExpand = (id) => {
    setExpanded((s) => ({ ...s, [id]: !s[id] }));
  };

  return (
    <div className="w-screen min-h-screen bg-[#f0efe7] pt-[80px] px-2 sm:px-4 md:px-8 flex flex-col items-center gap-3 sm:gap-4">
      <Nav />

      {/* Header + Clear All */}
      <div className="w-full max-w-[900px] shadow-lg rounded-lg p-3 sm:p-4 text-base sm:text-lg text-gray-700 bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
        <div className="text-[16px] sm:text-[22px] font-semibold">
          Notifications (<span className="font-bold">{notificationData.length}</span>)
        </div>

        {notificationData.length > 0 && (
          <div
            className="w-full sm:w-[120px] h-[36px] sm:h-[40px] rounded-full border-2 border-[#a8abdf] text-[#2dc0ff] flex justify-center items-center hover:bg-[#ade6e4] hover:text-[#7a0cf7] transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer text-[14px] sm:text-[17px]"
            onClick={handledeleteAllNotification}
          >
            Clear All
          </div>
        )}
      </div>

      {/* Notifications List */}
      {notificationData.length > 0 ? (
        <div className="w-full max-w-[900px] flex flex-col gap-3 sm:gap-4">
          {notificationData.map((noti, index) => {
            const id = noti._id || index;
            const relatedUser = noti.relatedUser || {};
            const post = noti.relatedPost;

            return (
              <div
                key={id}
                className="w-full bg-white shadow rounded-lg p-3 sm:p-4 flex flex-col sm:flex-row gap-3 sm:gap-4 relative hover:shadow-md transition-shadow"
              >
                {/* Left: Avatar + Info */}
                <div
                  className="flex items-start gap-3 flex-1 cursor-pointer"
                  onClick={() => handleGetProfile(relatedUser.userName)}
                >
                  <img
                    src={relatedUser.profileImage || dp}
                    alt={`${relatedUser.firstName || "User"} avatar`}
                    className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover flex-shrink-0 shadow-sm"
                  />

                  <div className="flex-1 min-w-0 flex flex-col gap-1 sm:gap-2">
                    {/* Name + Date */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2">
                      <div className="text-[14px] sm:text-[18px] font-semibold truncate">
                        {`${relatedUser.firstName || ""} ${relatedUser.lastName || ""}`}
                      </div>
                      <div className="text-[10px] sm:text-sm text-gray-500 mt-0 sm:mt-0">
                        {new Date(noti.createdAt || Date.now()).toLocaleString()}
                      </div>
                    </div>

                    {/* Notification message */}
                    <div className="text-[12px] sm:text-sm text-[#147ce5] font-medium mt-1">
                      {handleMessage(noti.type)}
                    </div>

                    {/* Description + Image */}
                    {post && (
                      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-2 sm:mt-3">
                        {post.image && (
                          <div className="w-full sm:w-[100px] h-[80px] sm:h-[100px] flex-shrink-0 rounded overflow-hidden bg-gray-50">
                            <img
                              src={post.image}
                              alt="Post thumbnail"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1">
                          {post.description && (
                            <div className="flex-1 border-l-4 border-r-4 rounded-lg bg-gray-50 p-2 sm:p-3">
                              <div
                                className={`break-words whitespace-pre-wrap text-[12px] sm:text-sm ${
                                  expanded[id] ? "" : "line-clamp-3"
                                }`}
                                style={{
                                  maxHeight: expanded[id] ? "none" : "4.5em",
                                  overflow: expanded[id] ? "visible" : "hidden",
                                }}
                              >
                                {post.description}
                              </div>

                              {post.description.length > 100 && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleExpand(id);
                                  }}
                                  className="mt-1 sm:mt-2 text-[11px] sm:text-sm font-medium text-blue-600 hover:underline"
                                >
                                  {expanded[id] ? "Show less" : "Read more"}
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Close Button */}
                <RxCross2
                  className="absolute top-2 sm:top-4 right-2 sm:right-3 text-xl sm:text-2xl text-gray-800 cursor-pointer hover:text-red-500"
                  onClick={() => handledeleteOneNotification(id)}
                />
              </div>
            );
          })}
        </div>
      ) : (
        <div className="w-full max-w-[900px] bg-white shadow rounded-lg p-4 text-center text-gray-600 text-sm sm:text-base">
          No notifications yet
        </div>
      )}
    </div>
  );
}

