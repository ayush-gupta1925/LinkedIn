import getToken from "../config/token.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

export const signUp = async (req, res) => {
  try {
    let { firstName, lastName, userName, email, password } = req.body;
    let existEmail = await User.findOne({ email });
    if (existEmail) {
      return res.status(400).json({ message: "email already exists" });
    }
    let existUsername = await User.findOne({ userName });
    if (existUsername) {
      return res.status(400).json({ message: "username already exists" });
    }

    if (password.length < 8) {
      console.log(password.length);
      return res
        .status(400)
        .json({ message: "password must be greater than 8 charecters" });
    }
    let hassedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      firstName,
      lastName,
      userName,
      email,
      password: hassedPassword
    });
    let token = await getToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "strict",
      secure: process.env.NODE_ENVIRONMENT === "production"
    });
    return res.status(201).json(user);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "err"
    });
  }
};

export const login = async (req, res) => {
  try {
    let { email, password } = req.body;
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "user does not exists" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "incorrect password" });
    }
    let token = await getToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "strict",
      secure: process.env.NODE_ENVIRONMENT === "production"
    });
    return res.status(200).json(user);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: " login err"
    });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({
      message: " logout successfully"
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: " logout err"
    });
  }
};

let otpStore = {}; // Temporary store { email: { otp, expires } }

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Email not found" });

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore[email] = { otp, expires: Date.now() + 5 * 60 * 1000 }; // 5 min expiry

    // Send Email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // tumhara gmail address
        pass: process.env.EMAIL_PASS // app password (normal gmail password nahi)
      }
    });
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP is ${otp}. It will expire in 5 minutes.`
    });

    return res.status(200).json({ message: "OTP sent to email" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error sending OTP" });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const stored = otpStore[email];
    if (!stored) return res.status(400).json({ message: "OTP not found" });
    if (stored.expires < Date.now())
      return res.status(400).json({ message: "OTP expired" });
    if (stored.otp !== otp)
      return res.status(400).json({ message: "Invalid OTP" });

    return res.status(200).json({ message: "OTP verified" });
  } catch (err) {
    return res.status(500).json({ message: "Error verifying OTP" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const stored = otpStore[email];
    if (!stored) return res.status(400).json({ message: "OTP not found" });
    if (stored.expires < Date.now())
      return res.status(400).json({ message: "OTP expired" });
    if (stored.otp !== otp)
      return res.status(400).json({ message: "Invalid OTP" });

    const hashed = await bcrypt.hash(newPassword, 10);
    await User.findOneAndUpdate({ email }, { password: hashed });

    delete otpStore[email];
    return res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Error resetting password" });
  }
};
