import Notification from "../models/notification.model.js";
import { io } from "../index.js";
export const getNotification = async (req, res) => {
  try {
    let notification = await Notification.find({ receiver: req.userId })
      .populate("relatedUser", "firstName lastName profileImage userName")
      .populate("relatedPost", "image description ");

    return res.status(200).json(notification);
  } catch (err) {
    return res.status(500).json({ message: `notification err h ${err}` });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    let { id } = req.params;

    await Notification.findOneAndDelete({
      _id: id,
      receiver: req.userId
    });
    io.emit("notification-update", { receiver: req.userId });
    return res.status(200).json({ message: `Notification deleted` });
  } catch (err) {
    return res
      .status(500)
      .json({ message: `Notification error: ${err.message}` });
  }
};

export const clearAllNotification = async (req, res) => {
  try {
    await Notification.deleteMany({
      receiver: req.userId
    });
    io.emit("notification-update", { receiver: req.userId });
    return res.status(200).json({ message: `Notification deleted` });
  } catch (err) {
    return res
      .status(500)
      .json({ message: ` delete allNotification error: ${err.message}` });
  }
};
