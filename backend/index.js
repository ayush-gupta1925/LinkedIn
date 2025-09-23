import express from "express";
import dotenv from "dotenv";
import connectDb from "./config/db.js";
import authRouter from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRouter from "./routes/user.routes.js";
import postRouter from "./routes/post.routes.js";
import connectionRouter from "./routes/connection.routes.js";
import http from "http";
import { Server } from "socket.io";
import notificationRouter from "./routes/notification.routes.js";
import chatRouter from "./routes/chat.routes.js";
dotenv.config();
let app = express();
let server = http.createServer(app);
export const io = new Server(server, {
  cors: {
    origin: "https://linkedin-frontends.onrender.com",
    credentials: true
  }
});
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "https://linkedin-frontends.onrender.com",
    credentials: true
  })
);

let port = process.env.PORT || 5000;

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/post", postRouter);
app.use("/api/connection", connectionRouter);
app.use("/api/notification", notificationRouter);
// After app initialization
app.use("/api/chat", chatRouter);
export const userSocketMap = new Map();
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("register", (userId) => {
    userSocketMap.set(userId, socket.id);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(port, () => {
  connectDb();
  console.log(`server is running on ${port}`);
});
