import express from "express";
import isAuth from "../middleWares/isAuth.js";
import { getOwnerOrders, getUserOrders, placeOrder } from "../controllers/orderController.js";

const orderRouter = express.Router();

orderRouter.post("/place-order", isAuth, placeOrder);
orderRouter.post("/user-order", isAuth, getUserOrders);
orderRouter.post("/owner-order", isAuth, getOwnerOrders);

export default orderRouter;
