import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { userDataContext } from "../context/userContext.jsx";
import { authDataContext } from "../context/AuthContext.jsx";
import dp from "../assets/dp.png";
import { IoArrowBackOutline } from "react-icons/io5";
import { IoArrowBack } from "react-icons/io5";
function ConversationsList() {
  const { userData } = useContext(userDataContext);
  const { serverUrl } = useContext(authDataContext);
  const [conversations, setConversations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await axios.get(`${serverUrl}/api/chat/list`, {
          withCredentials: true
        });
        setConversations(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchConversations();
  }, [serverUrl]);

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-blue-100 to-blue-50 flex flex-col items-center py-4">
      {/* Nav */}

      <button
        onClick={() => navigate("/")}
        className="text-[#373535] font-bold hover:bg-blue-500 p-2 rounded transition absolute top-4 left-6"
      >
        <IoArrowBack className="w-8 h-7" />
      </button>

      <div className="w-[60%] bg-blue-600 text-white p-4 rounded-lg shadow flex items-center gap-4">
        <span className="text-xl font-bold">Conversations</span>
      </div>

      {/* Conversations list */}
      <div className="w-[60%] bg-white shadow mt-4 rounded-lg p-4 flex flex-col gap-3">
        {conversations.length === 0 ? (
          <div className="text-gray-500 text-center py-10 text-lg">
            No chats yet
          </div>
        ) : (
          conversations.map((chat) => {
            const otherUser = chat.participants.find(
              (u) => u._id !== userData._id
            );

            return (
              <div
                key={chat._id}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 cursor-pointer transition"
                onClick={() => navigate(`/chat/${otherUser._id}`)}
              >
                <img
                  src={otherUser?.profileImage || dp}
                  alt="dp"
                  className="w-[50px] h-[50px] rounded-full object-cover border-2 border-blue-300"
                />
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <div className="font-semibold text-gray-800 text-md">
                      {otherUser?.firstName} {otherUser?.lastName}
                    </div>
                    {chat.lastMessage && (
                      <div className="text-xs text-gray-400">
                        {new Date(
                          chat.lastMessage.createdAt
                        ).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </div>
                    )}
                  </div>
                  <div className="text-sm text-gray-500 truncate">
                    {chat.lastMessage
                      ? chat.lastMessage.sender._id === userData._id
                        ? "You: " + chat.lastMessage.content
                        : chat.lastMessage.content
                      : "No messages yet"}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default ConversationsList;
