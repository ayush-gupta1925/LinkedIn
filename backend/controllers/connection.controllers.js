import User from "../models/user.model.js";
import Connection from "../models/connection.model.js";
import { request } from "express";
import { io, userSocketMap } from "../index.js";
import { updateProfile } from "./user.controllers.js";
import Notification from "../models/notification.model.js";

export const sendConnection = async (req, res) => {
  try {
    let { id } = req.params;
    let sender = req.userId;
    let senderUser = await User.findById(sender);
    let receiverUser = await User.findById(id);

    if (sender == id) {
      return res
        .status(400)
        .json({ message: "You cannot send request to yourself" });
    }

    if (senderUser.connection.includes(id)) {
      return res.status(400).json({ message: "You are already connected" });
    }

    let existingConnection = await Connection.findOne({
      sender,
      receiver: id,
      status: "Pending"
    });

    if (existingConnection) {
      return res.status(400).json({ message: "Request already exists" });
    }

    let newRequest = await Connection.create({
      sender,
      receiver: id
    });

    // Get socket IDs
    let receiverSocketId = userSocketMap.get(id);
    let senderSocketId = userSocketMap.get(sender);

    // Emit event to receiver
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("statusUpdate", {
        receiverId: id,
        newStatus: "Received",
        senderName: `${senderUser.firstName} ${senderUser.lastName}`
      });
    }

    // Emit event to sender
    if (senderSocketId) {
      io.to(senderSocketId).emit("statusUpdate", {
        updatedUserId: id,
        newStatus: "Pending",
        receiverName: `${receiverUser.firstName} ${receiverUser.lastName}` // optional
      });
    }

    return res.status(200).json(newRequest);
  } catch (err) {
    return res.status(500).json({ message: `sendConnection error ${err}` });
  }
};

export const acceptConnection = async (req, res) => {
  try {
    let { connectionId } = req.params;
    let userId = req.userId;
    let connection = await Connection.findById(connectionId);
    if (!connection) {
      return res.status(400).json({ message: "connection does not exist" });
    }
    if (connection.status !== "Pending") {
      return res.status(400).json({ message: "request under process" });
    }
    connection.status = "Accepted";

    let notification = await Notification.create({
      receiver: connection.sender,
      type: "connectionAccepted",
      relatedUser: userId
    });
    await connection.save();

    // Add each other to connections
    await User.findByIdAndUpdate(req.userId, {
      $addToSet: { connection: connection.sender._id }
    });

    await User.findByIdAndUpdate(connection.sender._id, {
      $addToSet: { connection: req.userId }
    });

    let receiverSocketId = userSocketMap.get(
      connection.receiver._id.toString()
    );
    let senderSocketId = userSocketMap.get(connection.sender._id.toString());
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("statusUpdate", {
        updatedUserId: connection.sender._id,
        newStatus: "Disconnect"
      });
    }
    if (senderSocketId) {
      io.to(senderSocketId).emit("statusUpdate", {
        updatedUserId: req.userId,
        newStatus: "Disconnect"
      });
    }
    io.emit("notification-update", { receiver: req.userId });
    return res.status(200).json({ message: "connection accepted" });
  } catch (err) {
    return res.status(500).json({ message: `connection error ${err}` });
  }
};

export const rejectedConnection = async (req, res) => {
  try {
    let { connectionId } = req.params;
    let connection = await Connection.findById(connectionId);
    if (!connection) {
      return res.status(400).json({ message: "connection does not exist" });
    }
    if (connection.status !== "Pending") {
      return res.status(400).json({ message: "request under process" });
    }

    connection.status = "Rejected";
    await connection.save();

    // Notify sender and receiver about rejection in real-time
    let receiverSocketId = userSocketMap.get(connection.receiver.toString());
    let senderSocketId = userSocketMap.get(connection.sender.toString());

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("statusUpdate", {
        updatedUserId: connection.sender.toString(),
        newStatus: "Rejected"
      });
    }
    if (senderSocketId) {
      io.to(senderSocketId).emit("statusUpdate", {
        updatedUserId: connection.receiver.toString(),
        newStatus: "Rejected"
      });
    }

    return res.status(200).json({ message: "connection rejected" });
  } catch (err) {
    return res.status(500).json({ message: `rejected error ${err}` });
  }
};

export const getConnectionStatus = async (req, res) => {
  try {
    const targerUserId = req.params.userId;
    const currrentUserId = req.userId;
    let currrentUser = await User.findById(currrentUserId);
    if (currrentUser.connection.includes(targerUserId)) {
      return res.json({ status: "Disconnect" });
    }

    const pendingRequest = await Connection.findOne({
      $or: [
        { sender: currrentUserId, receiver: targerUserId },
        { sender: targerUserId, receiver: currrentUserId }
      ],
      status: "Pending"
    });
    if (pendingRequest) {
      if (pendingRequest.sender.toString() === currrentUserId.toString()) {
        return res.json({ status: "Pending" });
      } else {
        return res.json({ status: "Received", requestId: pendingRequest._id });
      }
    }

    return res.json({ status: "Connect" });
  } catch (err) {
    return res.status(500).json({ message: "getconnection error" });
  }
};

export const removeConnection = async (req, res) => {
  try {
    const myId = req.userId;
    const otherUserId = req.params.userId;

    // Remove myId from other user's connections
    await User.findByIdAndUpdate(otherUserId, {
      $pull: { connection: myId }
    });

    // Remove otherUserId from my connections
    await User.findByIdAndUpdate(myId, {
      $pull: { connection: otherUserId }
    });

    // Notify both users via socket
    let receiverSocketId = userSocketMap.get(otherUserId);
    let senderSocketId = userSocketMap.get(myId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("statusUpdate", {
        updatedUserId: myId,
        newStatus: "Connect"
      });
    }
    if (senderSocketId) {
      io.to(senderSocketId).emit("statusUpdate", {
        updatedUserId: otherUserId,
        newStatus: "Connect"
      });
    }

    return res.json({ message: "Connection removed successfully" });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Removed Connections error", error: err.message });
  }
};

export const getConnectionRequest = async (req, res) => {
  try {
    const userId = req.userId; // Yeh actual logged-in user ka ID hai

    const pendingRequests = await Connection.find({
      receiver: userId,
      status: "Pending"
    }).populate(
      "sender",
      "firstName lastName email userName profileImage headline"
    );

    return res.status(200).json(pendingRequests);
  } catch (err) {
    console.error("error in getConnectionRequest controller", err);
    return res.status(500).json({ message: "server error" });
  }
};
export const getUserConnections = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId).populate(
      "connection",
      "firstName lastName userName profileImage headline connection"
    );

    // Emit event to current user socket for real-time

    return res.status(200).json(user.connection);
  } catch (err) {
    console.error("error in getConnectionRequest controller", err);
    return res.status(500).json({ message: "server error" });
  }
};
