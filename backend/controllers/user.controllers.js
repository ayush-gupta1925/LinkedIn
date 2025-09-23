import User from "../models/user.model.js";
import { uploadOnCloudinary } from "../config/cloudinary.js"; // ✅ CORRECT

export const getCurrentUser = async (req, res) => {
  try {
    let id = req.userId;
    const user = await User.findById(id).select("-password");
    if (!user) {
      return res.status(400).json({ message: "user does not found" });
    }
    return res.status(200).json(user);
  } catch (err) {
    return res.status(400).json({ message: "curent user error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    let { firstName, lastName, userName, headline, location, gender } =
      req.body;
    let skills = req.body.skills ? JSON.parse(req.body.skills) : [];
    let education = req.body.education ? JSON.parse(req.body.education) : [];
    let experience = req.body.experience ? JSON.parse(req.body.experience) : [];

    let profileImage;
    let coverImage;
    console.log(req.files);
    if (req.files.profileImage) {
      profileImage = await uploadOnCloudinary(req.files.profileImage[0].path);
    }

    if (req.files.coverImage) {
      coverImage = await uploadOnCloudinary(req.files.coverImage[0].path);
    }

    let user = await User.findByIdAndUpdate(
      req.userId,
      {
        firstName,
        lastName,
        userName,
        headline,
        location,
        gender,
        skills,
        education,
        experience,
        profileImage,
        coverImage
      },
      { new: true }
    ).select("-password");

    return res.status(200).json(user);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "update error" });
  }
};
export const getProfile = async (req, res) => {
  try {
    const { userName } = req.params;
    console.log("Requested userName:", userName); // <-- add this

    let user = await User.findOne({ userName }).select("-password");
    if (!user) {
      return res.status(400).json({ message: "user not exist" });
    }
    return res.status(200).json(user);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "profile error" });
  }
};

export const search = async (req, res) => {
  try {
    let { query } = req.query;
    if (!query) {
      return res.status(400).json({ message: "query is required" });
    }
    let users = await User.find({
      $or: [
        { firstName: { $regex: query, $options: "i" } },
        { lastName: { $regex: query, $options: "i" } },
        { userName: { $regex: query, $options: "i" } },
        { skills: { $in: [query] } }
      ]
    });
    res.status(200).json(users);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "search error" });
  }
};

export const getSuggestedUser = async (req, res) => {
  try {
    // Pehle current user fetch karo with only connections
    const currentUser = await User.findById(req.userId).select("connection");

    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Suggested users = jinka ID current user ka ID nahi hai
    // aur jo already connection list me nahi hai
    const suggestedUser = await User.find({
      _id: { $ne: currentUser._id, $nin: currentUser.connection }
    }).select("-password");

    return res.status(200).json(suggestedUser);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};
