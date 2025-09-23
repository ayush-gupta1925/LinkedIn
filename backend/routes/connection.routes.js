import express from "express";
import {
  acceptConnection,
  rejectedConnection,
  sendConnection,
  getConnectionStatus,
  removeConnection,
  getConnectionRequest,
  getUserConnections
} from "../controllers/connection.controllers.js";
import isAuth from "../middlewares/isAuth.js";
let connectionRouter = express.Router();

connectionRouter.post("/send/:id", isAuth, sendConnection);

connectionRouter.put("/accept/:connectionId", isAuth, acceptConnection);

connectionRouter.put("/reject/:connectionId", isAuth, rejectedConnection);

connectionRouter.get("/getStatus/:userId", isAuth, getConnectionStatus);

connectionRouter.delete("/remove/:userId", isAuth, removeConnection);

connectionRouter.get("/requests", isAuth, getConnectionRequest);

connectionRouter.get("/", isAuth, getUserConnections);

export default connectionRouter;
