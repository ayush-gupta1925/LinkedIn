// import React, { useEffect, useState, useContext } from "react";
// import Nav from "../components/Nav";
// import { authDataContext } from "../context/AuthContext.jsx";
// import { RxCrossCircled } from "react-icons/rx";
// import { FaRegCircleCheck } from "react-icons/fa6";
// import axios from "axios";
// import dp from "../assets/dp.png";
// import { userDataContext } from "../context/UserContext.jsx";

// function Network() {
//   const { serverUrl } = useContext(authDataContext);
//   const {
//     handleGetProfile,
//     userConnections,
//     setUserConnections,
//     fetchUserConnections
//   } = useContext(userDataContext);

//   const [requests, setRequests] = useState([]);
//   const [loadingConnections, setLoadingConnections] = useState(false);
//   const [loadingRequests, setLoadingRequests] = useState(false);

//   // get pending connection requests
//   const handleGetRequests = async () => {
//     try {
//       setLoadingRequests(true);
//       const res = await axios.get(`${serverUrl}/api/connection/requests`, {
//         withCredentials: true
//       });
//       setRequests(res.data || []);
//     } catch (err) {
//       console.error("get requests error:", err);
//       setRequests([]);
//     } finally {
//       setLoadingRequests(false);
//     }
//   };

//   const handleAcceptConnection = async (requestId) => {
//     try {
//       await axios.put(
//         `${serverUrl}/api/connection/accept/${requestId}`,
//         {},
//         { withCredentials: true }
//       );
//       setRequests((prev) => prev.filter((r) => r._id !== requestId));
//       fetchUserConnections();
//     } catch (err) {
//       console.error("accept error:", err);
//     }
//   };

//   const handleRejectConnection = async (requestId) => {
//     try {
//       await axios.put(
//         `${serverUrl}/api/connection/reject/${requestId}`,
//         {},
//         { withCredentials: true }
//       );
//       setRequests((prev) => prev.filter((r) => r._id !== requestId));
//     } catch (err) {
//       console.error("reject error:", err);
//     }
//   };

//   const handleRemoveConnection = async (otherUserId) => {
//     try {
//       await axios.delete(`${serverUrl}/api/connection/remove/${otherUserId}`, {
//         withCredentials: true
//       });
//       fetchUserConnections();
//     } catch (err) {
//       console.error("remove connection error:", err);
//     }
//   };

//   useEffect(() => {
//     handleGetRequests();
//     fetchUserConnections();
//   }, []);

//   return (
//     <div className="w-screen min-h-[100vh] bg-[#f0efe7] pt-[100px] px-[20px] flex flex-col gap-6 items-center">
//       <Nav />
//       <div className="w-full max-w-[900px] h-[100px] shadow-lg rounded-lg p-4 text-[22px] text-gray-700 bg-white flex items-center justify-center">
//         Invitations ({requests.length})
//       </div>

//       {/* Requests List */}
//       <div className="w-full max-w-[900px] flex flex-col gap-4">
//         {loadingRequests ? (
//           <div className="p-6 bg-white shadow rounded text-center">
//             Loading requests...
//           </div>
//         ) : requests.length === 0 ? (
//           <div className="p-4 bg-white shadow rounded text-center">
//             No pending requests
//           </div>
//         ) : (
//           <div className="bg-white shadow rounded-lg overflow-hidden">
//             {requests.map((connection) => (
//               <div
//                 key={connection._id}
//                 className="w-full flex justify-between items-center p-4 border-b last:border-b-0 hover:bg-gray-50"
//               >
//                 <div
//                   className="flex items-center gap-4 cursor-pointer"
//                   onClick={() => handleGetProfile(connection.sender.userName)}
//                 >
//                   <img
//                     src={connection.sender.profileImage || dp}
//                     alt=""
//                     className="w-[60px] h-[60px] rounded-full object-cover"
//                   />
//                   <div>
//                     <div className="text-lg font-semibold text-gray-700">
//                       {connection.sender.firstName} {connection.sender.lastName}
//                     </div>
//                     <div className="text-sm text-gray-600">
//                       {connection.sender.headline}
//                     </div>
//                   </div>
//                 </div>

//                 <div className="flex items-center gap-3">
//                   <button
//                     onClick={() => handleAcceptConnection(connection._id)}
//                     className="text-[#18c5ff] hover:text-blue-600"
//                     title="Accept"
//                   >
//                     <FaRegCircleCheck className="w-9 h-9" />
//                   </button>
//                   <button
//                     onClick={() => handleRejectConnection(connection._id)}
//                     className="text-[#ff4218] hover:text-red-600"
//                     title="Reject"
//                   >
//                     <RxCrossCircled className="w-9 h-9" />
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Connections */}
//       <div className="w-full max-w-[900px] mt-6">
//         <div className="flex items-center justify-between mb-4 w-full">
//           <h2 className="text-2xl font-semibold text-gray-700">
//             Your Connections ({userConnections.length})
//           </h2>
//         </div>

//         {loadingConnections ? (
//           <div className="p-6 bg-white shadow rounded text-center">
//             Loading connections...
//           </div>
//         ) : userConnections.length === 0 ? (
//           <div className="p-4 bg-white shadow rounded text-center">
//             You have no connections yet.
//           </div>
//         ) : (
//           <div className="bg-white shadow rounded-lg p-4">
//             <div className="w-full">
//               {userConnections.map((conn) => (
//                 <div
//                   key={conn._id}
//                   className="flex items-center gap-3 p-3 border-b  rounded hover:bg-[#f0f4f7]"
//                 >
//                   <img
//                     src={conn.profileImage || dp}
//                     alt={`${conn.firstName} ${conn.lastName}`}
//                     className="w-[60px] h-[60px] rounded-full object-cover cursor-pointer"
//                     onClick={() => handleGetProfile(conn.userName)}
//                   />
//                   <div className="flex w-full">
//                     <div className="flex-1 w-full">
//                       <div
//                         className="text-lg font-semibold text-gray-700 cursor-pointer"
//                         onClick={() => handleGetProfile(conn.userName)}
//                       >
//                         {conn.firstName} {conn.lastName}
//                       </div>
//                       <div className="text-sm text-gray-600 cursor-pointer">
//                         {conn.headline}
//                       </div>
//                     </div>
//                     <div className="mt-2 flex gap-9">
//                       <button
//                         onClick={() => handleGetProfile(conn.userName)}
//                         className="text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded hover:bg-[#bcced3]"
//                       >
//                         View
//                       </button>
//                       <button
//                         onClick={() => handleRemoveConnection(conn._id)}
//                         className="text-sm bg-red-50 text-red-600 px-3 py-1 rounded hover:bg-[#e2dada]"
//                       >
//                         Remove
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default Network;

import React, { useEffect, useState, useContext } from "react";
import Nav from "../components/Nav";
import { authDataContext } from "../context/AuthContext.jsx";
import { RxCrossCircled } from "react-icons/rx";
import { FaRegCircleCheck } from "react-icons/fa6";
import axios from "axios";
import dp from "../assets/dp.png";
import { userDataContext } from "../context/UserContext.jsx";

function Network() {
  const { serverUrl } = useContext(authDataContext);
  const {
    handleGetProfile,
    userConnections,
    fetchUserConnections
  } = useContext(userDataContext);

  const [requests, setRequests] = useState([]);
  const [loadingConnections, setLoadingConnections] = useState(false);
  const [loadingRequests, setLoadingRequests] = useState(false);

  // get pending connection requests
  const handleGetRequests = async () => {
    try {
      setLoadingRequests(true);
      const res = await axios.get(`${serverUrl}/api/connection/requests`, {
        withCredentials: true
      });
      setRequests(res.data || []);
    } catch (err) {
      console.error("get requests error:", err);
      setRequests([]);
    } finally {
      setLoadingRequests(false);
    }
  };

  const handleAcceptConnection = async (requestId) => {
    try {
      await axios.put(
        `${serverUrl}/api/connection/accept/${requestId}`,
        {},
        { withCredentials: true }
      );
      setRequests((prev) => prev.filter((r) => r._id !== requestId));
      fetchUserConnections();
    } catch (err) {
      console.error("accept error:", err);
    }
  };

  const handleRejectConnection = async (requestId) => {
    try {
      await axios.put(
        `${serverUrl}/api/connection/reject/${requestId}`,
        {},
        { withCredentials: true }
      );
      setRequests((prev) => prev.filter((r) => r._id !== requestId));
    } catch (err) {
      console.error("reject error:", err);
    }
  };

  const handleRemoveConnection = async (otherUserId) => {
    try {
      await axios.delete(`${serverUrl}/api/connection/remove/${otherUserId}`, {
        withCredentials: true
      });
      fetchUserConnections();
    } catch (err) {
      console.error("remove connection error:", err);
    }
  };

  useEffect(() => {
    handleGetRequests();
    fetchUserConnections();
  }, []);

  return (
    <div className="w-screen min-h-[100vh] bg-[#f0efe7] pt-[100px] px-3 sm:px-[20px] flex flex-col gap-6 items-center">
      <Nav />
      <div className="w-full max-w-[900px] h-[80px] sm:h-[100px] shadow-lg rounded-lg p-3 sm:p-4 text-[18px] sm:text-[22px] text-gray-700 bg-white flex items-center justify-center">
        Invitations ({requests.length})
      </div>

      {/* Requests List */}
      <div className="w-full max-w-[900px] flex flex-col gap-3 sm:gap-4">
        {loadingRequests ? (
          <div className="p-4 sm:p-6 bg-white shadow rounded text-center text-sm sm:text-base">
            Loading requests...
          </div>
        ) : requests.length === 0 ? (
          <div className="p-3 sm:p-4 bg-white shadow rounded text-center text-sm sm:text-base">
            No pending requests
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            {requests.map((connection) => (
              <div
                key={connection._id}
                className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 p-3 sm:p-4 border-b last:border-b-0 hover:bg-gray-50"
              >
                <div
                  className="flex items-center gap-3 sm:gap-4 cursor-pointer w-full sm:w-auto"
                  onClick={() => handleGetProfile(connection.sender.userName)}
                >
                  <img
                    src={connection.sender.profileImage || dp}
                    alt=""
                    className="w-[45px] h-[45px] sm:w-[60px] sm:h-[60px] rounded-full object-cover"
                  />
                  <div className="flex flex-col">
                    <div className="text-sm sm:text-lg font-semibold text-gray-700">
                      {connection.sender.firstName} {connection.sender.lastName}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600">
                      {connection.sender.headline}
                    </div>
                  </div>
                </div>

                {/* Right aligned buttons for medium/large */}
                <div className="flex items-center gap-2 sm:gap-3 sm:ml-auto self-end sm:self-center">
                  <button
                    onClick={() => handleAcceptConnection(connection._id)}
                    className="text-[#18c5ff] hover:text-blue-600"
                    title="Accept"
                  >
                    <FaRegCircleCheck className="w-6 h-6 sm:w-9 sm:h-9" />
                  </button>
                  <button
                    onClick={() => handleRejectConnection(connection._id)}
                    className="text-[#ff4218] hover:text-red-600"
                    title="Reject"
                  >
                    <RxCrossCircled className="w-6 h-6 sm:w-9 sm:h-9" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Connections */}
      <div className="w-full max-w-[900px] mt-4 sm:mt-6">
        <div className="flex items-center justify-between mb-3 sm:mb-4 w-full">
          <h2 className="text-lg sm:text-2xl font-semibold text-gray-700">
            Your Connections ({userConnections.length})
          </h2>
        </div>

        {loadingConnections ? (
          <div className="p-4 sm:p-6 bg-white shadow rounded text-center text-sm sm:text-base">
            Loading connections...
          </div>
        ) : userConnections.length === 0 ? (
          <div className="p-3 sm:p-4 bg-white shadow rounded text-center text-sm sm:text-base">
            You have no connections yet.
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg p-3 sm:p-4">
            <div className="w-full flex flex-col gap-3">
              {userConnections.map((conn) => (
                <div
                  key={conn._id}
                  className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 p-2 sm:p-3 border-b last:border-b-0 hover:bg-[#f0f4f7]"
                >
                  <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
                    <img
                      src={conn.profileImage || dp}
                      alt={`${conn.firstName} ${conn.lastName}`}
                      className="w-[45px] h-[45px] sm:w-[60px] sm:h-[60px] rounded-full object-cover cursor-pointer"
                      onClick={() => handleGetProfile(conn.userName)}
                    />
                    <div className="flex flex-col">
                      <div
                        className="text-sm sm:text-lg font-semibold text-gray-700 cursor-pointer"
                        onClick={() => handleGetProfile(conn.userName)}
                      >
                        {conn.firstName} {conn.lastName}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600 cursor-pointer">
                        {conn.headline}
                      </div>
                    </div>
                  </div>

                  {/* Buttons right side for medium/large */}
                  <div className="flex gap-2 sm:gap-4 sm:ml-auto mt-1 sm:mt-0 self-end sm:self-center">
                    <button
                      onClick={() => handleGetProfile(conn.userName)}
                      className="text-xs sm:text-sm bg-blue-50 text-blue-600 px-2 sm:px-3 py-1 rounded hover:bg-[#bcced3]"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleRemoveConnection(conn._id)}
                      className="text-xs sm:text-sm bg-red-50 text-red-600 px-2 sm:px-3 py-1 rounded hover:bg-[#e2dada]"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Network;

