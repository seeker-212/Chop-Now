import express from "express";
import {
  getCurrentUser,
  updateUserLocation,
} from "../controllers/userController.js";
import isAuth from "../middleWares/isAuth.js";

const userRouter = express.Router();

userRouter.get("/current-user", isAuth, getCurrentUser);
userRouter.post("/update-location", isAuth, updateUserLocation);

export default userRouter;
