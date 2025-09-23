import express from "express";
import isAuth from "../middlewares/isAuth.js";
import {
  createPost,
  getPost,
  like,
  comment,
  editPost,
  deletePost
} from "../controllers/post.contollers.js";
import upload from "../middlewares/multer.js";
const postRouter = express.Router();

postRouter.post("/create", isAuth, upload.single("image"), createPost);

postRouter.get("/getpost", isAuth, getPost);

postRouter.get("/like/:id", isAuth, like);

postRouter.post("/comment/:id", isAuth, comment);

postRouter.put("/edit/:id", isAuth, upload.single("image"), editPost);
// Edit post route
postRouter.delete("/delete/:id", isAuth, deletePost);
export default postRouter;
