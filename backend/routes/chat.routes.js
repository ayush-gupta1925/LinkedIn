import express from "express";
import {
  sendMessage,
  getChat,
  deleteMessage,
  deleteConversation,
  getConversations,
} from "../controllers/chat.controllers.js";
import isAuth from "../middlewares/isAuth.js";

const chatRouter = express.Router();

// ✅ List conversations (put BEFORE /:userId)
chatRouter.get("/list", isAuth, getConversations);

// ✅ Send message
chatRouter.post("/send", isAuth, sendMessage);

// ✅ Get conversation with specific user
chatRouter.get("/:userId", isAuth, getChat);

// ✅ Delete single message
chatRouter.delete("/message/:messageId", isAuth, deleteMessage);

// ✅ Delete entire conversation
chatRouter.delete("/conversation/:userId", isAuth, deleteConversation);

export default chatRouter;
