// import React, { useContext, useEffect, useState, useRef } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { IoMdSend } from "react-icons/io";
// import { MdDelete } from "react-icons/md";
// import dp from "../assets/dp.png";
// import { userDataContext, socket } from "../context/UserContext.jsx";
// import { authDataContext } from "../context/AuthContext.jsx";
// import { IoArrowBack } from "react-icons/io5";
// import moment from "moment";

// function ChatPage() {
//   const { userId } = useParams();
//   const { userData } = useContext(userDataContext);
//   const { serverUrl } = useContext(authDataContext);
//   const navigate = useNavigate();

//   const [messages, setMessages] = useState([]);
//   const [receiver, setReceiver] = useState(null);
//   const [content, setContent] = useState("");
//   const [selectedMsgId, setSelectedMsgId] = useState(null);

//   const chatContainerRef = useRef(null);

 

//   useEffect(() => {
//     const fetchChat = async () => {
//       try {
//         const res = await axios.get(`${serverUrl}/api/chat/${userId}`, {
//           withCredentials: true
//         });

//         setMessages(res.data.messages || []);

//         // Set receiver immediately
//         if (res.data.participants) {
//           const otherUser = res.data.participants.find(
//             (u) => u._id !== userData._id
//           );
//           setReceiver(otherUser || null);
//         }
//       } catch (err) {
//         console.log(err);
//       }
//     };

//     // Reset receiver before fetching new data
//     setReceiver(null);
//     setMessages([]);
//     fetchChat();
//   }, [userId, serverUrl, userData]);

//   // Auto scroll
//   useEffect(() => {
//     if (chatContainerRef.current) {
//       chatContainerRef.current.scrollTop =
//         chatContainerRef.current.scrollHeight;
//     }
//   }, [messages]);

//   // Socket listeners
//   useEffect(() => {
//     socket.emit("register", userData._id);

//     const handleNewMessage = ({ message }) => {
//       setMessages((prev) =>
//         prev.some((m) => m._id === message._id) ? prev : [...prev, message]
//       );
//     };

//     const handleDeleteMessage = ({ messageId }) => {
//       setMessages((prev) =>
//         prev.map((m) => (m._id === messageId ? { ...m, isDeleted: true } : m))
//       );
//     };

//     const handleDeleteConversation = () => {
//       setMessages([]);
//     };

//     socket.on("newMessage", handleNewMessage);
//     socket.on("messageDeleted", handleDeleteMessage);
//     socket.on("conversationDeleted", handleDeleteConversation);

//     return () => {
//       socket.off("newMessage", handleNewMessage);
//       socket.off("messageDeleted", handleDeleteMessage);
//       socket.off("conversationDeleted", handleDeleteConversation);
//     };
//   }, [userData._id, userId]);

//   // Send Message
//   const sendMessage = async (e) => {
//     e.preventDefault();
//     if (!content.trim()) return;

//     try {
//       await axios.post(
//         `${serverUrl}/api/chat/send`,
//         { receiverId: userId, content },
//         { withCredentials: true }
//       );
//       setContent("");
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   // Delete single message
//   const deleteMessage = async (msgId) => {
//     try {
//       await axios.delete(`${serverUrl}/api/chat/message/${msgId}`, {
//         withCredentials: true
//       });
//       setSelectedMsgId(null);
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   // Delete entire conversation
//   const deleteConversation = async () => {
//     try {
//       await axios.delete(`${serverUrl}/api/chat/conversation/${userId}`, {
//         withCredentials: true
//       });
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   return (
//     <div className="w-full min-h-screen bg-blue-50 flex flex-col items-center py-4">
//       {/* Nav */}
//       <button
//         onClick={() => navigate("/conversations")}
//         className="text-[#373535] font-bold hover:bg-blue-500 p-2 rounded transition absolute top-4 left-6"
//       >
//         <IoArrowBack className="w-8 h-7" />
//       </button>
//       <div className="w-[60%] flex justify-between items-center bg-blue-600 text-white p-4 rounded-lg shadow">
//         <div className="flex items-center gap-3">
//           <img
//             src={receiver?.profileImage || dp} // placeholder dp
//             alt="dp"
//             className="w-[45px] h-[45px] rounded-full object-cover border-2 border-white"
//           />
//           <div className="text-md font-semibold">
//             {receiver
//               ? `${receiver.firstName} ${receiver.lastName}`
//               : "Loading..."}
//           </div>
//         </div>

//         <button
//           onClick={deleteConversation}
//           className="text-white hover:bg-red-400 p-2 rounded transition flex items-center gap-1"
//           title="Delete Conversation"
//         >
//           <MdDelete className="w-6 h-6 text-[#74041c]" />
//         </button>
//       </div>

//       {/* Chat container */}
//       <div className="w-[60%] flex-1 mt-4 bg-white shadow rounded-lg flex flex-col">
//         {/* Messages */}
//         <div
//           ref={chatContainerRef}
//           className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-gray-50"
//         >
//           {messages.map((msg) => (
//             <div
//               key={msg._id}
//               className={`flex ${
//                 msg.sender === userData._id ? "justify-end" : "justify-start"
//               }`}
//               onClick={() => {
//                 if (msg.sender === userData._id) {
//                   setSelectedMsgId((prev) =>
//                     prev === msg._id ? null : msg._id
//                   );
//                 }
//               }}
//             >
//               <div
//                 className={`max-w-[60%] p-2 rounded-lg shadow relative cursor-pointer transition-colors duration-200 ${
//                   msg.sender === userData._id
//                     ? "bg-blue-500 text-white hover:bg-blue-400"
//                     : "bg-gray-300 text-gray-800 hover:bg-gray-200"
//                 }`}
//               >
//                 <div className="flex items-end gap-3">
//                   <span>
//                     {msg.isDeleted ? <i>Message deleted</i> : msg.content}
//                   </span>
//                   <span className="text-[10px] text-gray-700 opacity-70 flex-shrink-0">
//                     {moment(msg.createdAt).format("hh:mm A")}
//                   </span>
//                 </div>

//                 {/* Single message delete button */}
//                 {selectedMsgId === msg._id && !msg.isDeleted && (
//                   <button
//                     onClick={() => deleteMessage(msg._id)}
//                     className="absolute top-[-6px] right-[-10px] bg-[#e43d3d] rounded-full p-1 shadow hover:bg-red-500 hover:text-white"
//                   >
//                     <MdDelete />
//                   </button>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Input */}
//         <form
//           onSubmit={sendMessage}
//           className="h-[70px] border-t bg-white flex items-center px-4 gap-3 rounded-b-lg"
//         >
//           <input
//             type="text"
//             value={content}
//             onChange={(e) => setContent(e.target.value)}
//             placeholder="Type a message..."
//             className="flex-1 border rounded-full px-4 py-2 outline-none"
//           />
//           <button
//             type="submit"
//             className="bg-blue-500 text-white rounded-full p-3 hover:bg-blue-600"
//           >
//             <IoMdSend className="w-5 h-5" />
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default ChatPage;



import React, { useContext, useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { IoMdSend } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import dp from "../assets/dp.png";
import { userDataContext, socket } from "../context/UserContext.jsx";
import { authDataContext } from "../context/AuthContext.jsx";
import { IoArrowBack } from "react-icons/io5";
import moment from "moment";

function ChatPage() {
  const { userId } = useParams();
  const { userData } = useContext(userDataContext);
  const { serverUrl } = useContext(authDataContext);
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [receiver, setReceiver] = useState(null);
  const [content, setContent] = useState("");
  const [selectedMsgId, setSelectedMsgId] = useState(null);

  const chatContainerRef = useRef(null);

  // Fetch chat
  useEffect(() => {
    const fetchChat = async () => {
      try {
        const res = await axios.get(`${serverUrl}/api/chat/${userId}`, {
          withCredentials: true,
        });

        setMessages(res.data.messages || []);

        if (res.data.participants) {
          const otherUser = res.data.participants.find(
            (u) => u._id !== userData._id
          );
          setReceiver(otherUser || null);
        }
      } catch (err) {
        console.log(err);
      }
    };

    setReceiver(null);
    setMessages([]);
    fetchChat();
  }, [userId, serverUrl, userData]);

  // Auto scroll
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Socket listeners
  useEffect(() => {
    socket.emit("register", userData._id);

    const handleNewMessage = ({ message }) => {
      setMessages((prev) =>
        prev.some((m) => m._id === message._id) ? prev : [...prev, message]
      );
    };

    const handleDeleteMessage = ({ messageId }) => {
      setMessages((prev) =>
        prev.map((m) => (m._id === messageId ? { ...m, isDeleted: true } : m))
      );
    };

    const handleDeleteConversation = () => {
      setMessages([]);
    };

    socket.on("newMessage", handleNewMessage);
    socket.on("messageDeleted", handleDeleteMessage);
    socket.on("conversationDeleted", handleDeleteConversation);

    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("messageDeleted", handleDeleteMessage);
      socket.off("conversationDeleted", handleDeleteConversation);
    };
  }, [userData._id, userId]);

  // Send Message
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      await axios.post(
        `${serverUrl}/api/chat/send`,
        { receiverId: userId, content },
        { withCredentials: true }
      );
      setContent("");
    } catch (err) {
      console.log(err);
    }
  };

  // Delete single message
  const deleteMessage = async (msgId) => {
    try {
      await axios.delete(`${serverUrl}/api/chat/message/${msgId}`, {
        withCredentials: true,
      });
      setSelectedMsgId(null);
    } catch (err) {
      console.log(err);
    }
  };

  // Delete entire conversation
  const deleteConversation = async () => {
    try {
      await axios.delete(`${serverUrl}/api/chat/conversation/${userId}`, {
        withCredentials: true,
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="w-full min-h-screen bg-blue-50 flex flex-col items-center pt-4 pb-16 sm:pb-4 relative">
      {/* Nav + Back button */}
    <button
  onClick={() => navigate("/conversations")}
  className="text-[#373535] font-bold hover:bg-blue-500 hidden md:block p-2 rounded transition absolute top-4 left-2 sm:left-6 z-10"
>
  <IoArrowBack className="w-6 h-6 sm:w-8 sm:h-7" />
</button>


      {/* Header */}
      <div className="w-full sm:w-[80%] md:w-[70%] lg:w-[60%] flex justify-between items-center bg-blue-600 text-white px-3 sm:px-4 py-3 sm:py-4 rounded-lg shadow relative">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
           <button
  onClick={() => navigate("/conversations")}
  className="text-[#373535] font-bold hover:bg-blue-500 block md:hidden p-2 rounded transition absolute top-4 left-2 sm:left-6 z-10"
>
  <IoArrowBack className="w-6 h-6 sm:w-8 sm:h-7" />
</button>

          <img
            src={receiver?.profileImage || dp}
            alt="dp"
            className="w-8 h-8 sm:w-[40px] sm:h-[40px] md:w-[45px] md:h-[45px] rounded-full object-cover border-2 border-white flex-shrink-0"
          />
          <div className="text-sm sm:text-base md:text-md font-semibold truncate">
            {receiver
              ? `${receiver.firstName} ${receiver.lastName}`
              : "Loading..."}
          </div>
        </div>

        <button
          onClick={deleteConversation}
          className="ml-2 sm:ml-4 text-white hover:bg-red-400 p-2 rounded transition flex items-center gap-1 flex-shrink-0"
          title="Delete Conversation"
        >
          <MdDelete className="w-5 h-5 sm:w-6 sm:h-6 text-[#74041c]" />
        </button>
      </div>

      {/* Chat container */}
      <div className="w-full sm:w-[80%] md:w-[70%] lg:w-[60%] flex-1 mt-4 bg-white shadow rounded-lg flex flex-col relative">
        {/* Messages */}
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-2 sm:p-4 flex flex-col gap-2 sm:gap-3 bg-gray-50"
        >
          {messages.map((msg) => (
            <div
              key={msg._id}
              className={`flex ${
                msg.sender === userData._id ? "justify-end" : "justify-start"
              }`}
              onClick={() => {
                if (msg.sender === userData._id) {
                  setSelectedMsgId((prev) =>
                    prev === msg._id ? null : msg._id
                  );
                }
              }}
            >
              <div
                className={`max-w-[80%] sm:max-w-[70%] md:max-w-[60%] p-2 sm:p-3 rounded-lg shadow relative cursor-pointer transition-colors duration-200 ${
                  msg.sender === userData._id
                    ? "bg-blue-500 text-white hover:bg-blue-400"
                    : "bg-gray-300 text-gray-800 hover:bg-gray-200"
                }`}
              >
                <div className="flex items-end gap-2 sm:gap-3">
                  <span className="text-xs sm:text-sm break-words">
                    {msg.isDeleted ? <i>Message deleted</i> : msg.content}
                  </span>
                  <span className="text-[9px] sm:text-[10px] md:text-[11px] text-gray-700 opacity-70 flex-shrink-0">
                    {moment(msg.createdAt).format("hh:mm A")}
                  </span>
                </div>

                {/* Single message delete button */}
                {selectedMsgId === msg._id && !msg.isDeleted && (
                  <button
                    onClick={() => deleteMessage(msg._id)}
                    className="absolute top-[-6px] right-[-10px] bg-[#e43d3d] rounded-full p-1 shadow hover:bg-red-500 hover:text-white"
                  >
                    <MdDelete className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <form
          onSubmit={sendMessage}
          className="absolute bottom-14 sm:bottom-9 left-0 w-full sm:w-full flex items-center px-2 sm:px-4 gap-2 sm:gap-3"
        >
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 border rounded-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base outline-none shadow"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white rounded-full p-2 sm:p-3 hover:bg-blue-600 flex items-center justify-center shadow"
          >
            <IoMdSend className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChatPage;
