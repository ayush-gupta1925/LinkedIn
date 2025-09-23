import Post from "../models/post.model.js"; // path apne hisab se adjust kar
import { uploadOnCloudinary } from "../config/cloudinary.js";

import fs from "fs";
import path from "path";

import { io } from "../index.js";
import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";

export const createPost = async (req, res) => {
  try {
    let { description } = req.body;
    let newPost;

    if (req.file) {
      let image = await uploadOnCloudinary(req.file.path);
      newPost = await Post.create({
        author: req.userId,
        description,
        image
      });
    } else {
      newPost = await Post.create({
        author: req.userId,
        description
      });
    }

    // Fetch all posts again with populate and sorting
    const posts = await Post.find()
      .populate("author", "firstName lastName profileImage userName headline")
      .populate(
        "comment.user",
        "firstName lastName userName profileImage headline"
      )
      .sort({ createdAt: -1 });

    io.emit("postCreated", posts); // emit full updated post list

    return res.status(201).json(newPost);
  } catch (err) {
    return res.status(500).json({ message: err.message || err });
  }
};

export const getPost = async (req, res) => {
  try {
    const post = await Post.find()
      .populate("author", "firstName lastName profileImage userName headline")
      .populate(
        "comment.user",
        "firstName lastName userName profileImage headline"
      )
      .sort({ createdAt: -1 });

    // Emit posts to all connected clients

    return res.status(200).json(post);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error fetching posts" });
  }
};

// like
export const like = async (req, res) => {
  try {
    let postId = req.params.id;
    let userId = req.userId;
    let user = await User.findById(userId);
    let post = await Post.findById(postId);

    if (!post) {
      return res.status(400).json({ message: "post not found" });
    }

    if (post.like.includes(userId)) {
      post.like = post.like.filter((id) => id != userId);
    } else {
      post.like.push(userId);

      if (post.author != userId) {
        await Notification.create({
          receiver: post.author,
          type: "like",
          relatedUser: userId,
          relatedPost: postId
        });
      }
    }

    io.emit("notification-update", { receiver: post.author });

    io.emit("likedUpdated", {
      postId,
      likes: post.like,
      userName: `${user.firstName} ${user.lastName}`,
      postAuthor: post.author, // 🔹 track author
      action: post.like.includes(userId) ? "liked" : "unliked"
    });

    await post.save();
    return res.status(200).json({ like: post.like });
  } catch (err) {
    return res.status(500).json({ message: "like error" });
  }
};

// comment
export const comment = async (req, res) => {
  try {
    let postId = req.params.id;
    let userId = req.userId;
    let { content } = req.body;
    let user = await User.findById(userId);

    let post = await Post.findByIdAndUpdate(
      postId,
      { $push: { comment: { content, user: userId } } },
      { new: true }
    ).populate(
      "comment.user",
      "firstName userName lastName profileImage headline"
    );

    await Notification.create({
      receiver: post.author,
      type: "comment",
      relatedUser: userId,
      relatedPost: postId
    });

    io.emit("notification-update", { receiver: post.author });
    io.emit("commentAdded", {
      postId,
      comm: post.comment,
      userName: `${user.firstName} ${user.lastName}`,

      postAuthor: post.author // 🔹 track author
    });
    // << name added

    return res.status(200).json(post);
  } catch (err) {
    return res.status(500).json({ message: `comment error ${err}` });
  }
};

export const editPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.userId;
    const { description } = req.body;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.author.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Unauthorized to edit this post" });
    }

    let updatedFields = {};

    if (req.file) {
      const uploadResult = await uploadOnCloudinary(req.file.path);
      updatedFields.image =
        uploadResult.secure_url || uploadResult.url || uploadResult;
    }

    if (description !== undefined) {
      updatedFields.description = description;
    }

    if (Object.keys(updatedFields).length === 0) {
      return res.status(400).json({ message: "Nothing to update" });
    }

    let rest = await Post.findByIdAndUpdate(postId, updatedFields);
    console.log(rest);
    // Fetch fresh updated post after saving
    const updatedPost = await Post.findById(postId)
      .populate("author", "firstName lastName profileImage userName headline")
      .populate(
        "comment.user",
        "firstName lastName userName profileImage headline"
      );

    io.emit("postUpdated", updatedPost);

    return res.status(200).json(updatedPost);
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: err.message || "Error editing post" });
  }
};

export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.userId;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.author.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this post" });
    }

    await Post.findByIdAndDelete(postId);

    // Emit deleted post ID to all clients
    io.emit("postDeleted", postId);

    return res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error deleting post" });
  }
};
