import express from "express";
import isAuth from "../middlewares/isAuth.js"; // ✅ Correct: isAuth from isAuth.js
import upload from "../middlewares/multer.js"; // ✅ Correct: upload from multer.js

import {
  getCurrentUser,
  getProfile,
  getSuggestedUser,
  search,
  updateProfile
} from "../controllers/user.controllers.js";
import { getUserConnections } from "../controllers/connection.controllers.js";

const userRouter = express.Router();

userRouter.get("/currentuser", isAuth, getCurrentUser);

userRouter.put(
  "/updateprofile",
  isAuth,
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "coverImage", maxCount: 1 }
  ]),
  updateProfile
);

userRouter.get("/profile/:userName", isAuth, getProfile);

userRouter.get("/search", isAuth, search);

userRouter.get("/suggestedusers", isAuth, getSuggestedUser);
export default userRouter;
