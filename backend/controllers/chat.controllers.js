import Chat from "../models/chat.model.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import { io, userSocketMap } from "../index.js";

// ✅ Send message controller
export const sendMessage = async (req, res) => {
  try {
    const { receiverId, content } = req.body;
    const senderId = req.userId;

    if (!receiverId || !content) {
      return res.status(400).json({ message: "Receiver and content required" });
    }

    // Check if chat already exists between users
    let chat = await Chat.findOne({
      participants: { $all: [senderId, receiverId] }
    });

    if (!chat) {
      chat = await Chat.create({
        participants: [senderId, receiverId]
      });
    }

    // Create new message
    const message = await Message.create({
      sender: senderId,
      receiver: receiverId,
      content
    });

    chat.messages.push(message._id);
    chat.lastMessage = message._id;
    await chat.save();

    // Real-time emit to both users
    const receiverSocketId = userSocketMap.get(receiverId.toString());
    const senderSocketId = userSocketMap.get(senderId.toString());

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", { chatId: chat._id, message });
    }
    if (senderSocketId) {
      io.to(senderSocketId).emit("newMessage", { chatId: chat._id, message });
    }

    return res.status(200).json(message);
  } catch (err) {
    console.error("sendMessage error", err);
    return res.status(500).json({ message: "Error sending message" });
  }
};

// ✅ Get chat between two users
export const getChat = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.userId;

    let chat = await Chat.findOne({
      participants: { $all: [currentUserId, userId] }
    })
      .populate("messages")
      .populate("participants", "firstName lastName userName profileImage");

    if (!chat) return res.status(200).json({ messages: [] });

    return res.status(200).json(chat);
  } catch (err) {
    console.error("getChat error", err);
    return res.status(500).json({ message: "Error fetching chat" });
  }
};

// ✅ Delete single message (only for sender)
export const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.userId;

    const message = await Message.findById(messageId);
    if (!message) return res.status(404).json({ message: "Message not found" });

    if (message.sender.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this message" });
    }

    message.isDeleted = true;
    await message.save();

    // Real-time emit delete event
    const receiverSocketId = userSocketMap.get(message.receiver.toString());
    const senderSocketId = userSocketMap.get(userId.toString());

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("messageDeleted", { messageId });
    }
    if (senderSocketId) {
      io.to(senderSocketId).emit("messageDeleted", { messageId });
    }

    return res.status(200).json({ message: "Message deleted" });
  } catch (err) {
    console.error("deleteMessage error", err);
    return res.status(500).json({ message: "Error deleting message" });
  }
};

// ✅ Delete entire conversation for both users
export const deleteConversation = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.userId;

    const chat = await Chat.findOne({
      participants: { $all: [currentUserId, userId] }
    });

    if (!chat)
      return res.status(404).json({ message: "Conversation not found" });

    await Message.deleteMany({ _id: { $in: chat.messages } });
    await Chat.findByIdAndDelete(chat._id);

    // Real-time emit to both users
    const receiverSocketId = userSocketMap.get(userId.toString());
    const senderSocketId = userSocketMap.get(currentUserId.toString());

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("conversationDeleted", { chatId: chat._id });
    }
    if (senderSocketId) {
      io.to(senderSocketId).emit("conversationDeleted", { chatId: chat._id });
    }

    return res
      .status(200)
      .json({ message: "Conversation deleted successfully" });
  } catch (err) {
    console.error("deleteConversation error", err);
    return res.status(500).json({ message: "Error deleting conversation" });
  }
};

export const getConversations = async (req, res) => {
  try {
    const chats = await Chat.find({
      participants: req.userId
    })
      .populate("participants", "firstName lastName userName profileImage")
      .populate({
        path: "lastMessage",
        select: "content sender createdAt",
        populate: { path: "sender", select: "firstName lastName" }
      })
      .sort({ updatedAt: -1 });

    return res.status(200).json(chats);
  } catch (err) {
    console.error("getConversations error", err);
    return res.status(500).json({ message: "Error fetching conversations" });
  }
};
