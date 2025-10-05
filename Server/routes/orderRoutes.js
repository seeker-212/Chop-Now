import express from "express";
import isAuth from "../middleWares/isAuth.js";
import { getMyOrders, placeOrder } from "../controllers/orderController.js";

const orderRouter = express.Router();

orderRouter.post("/place-order", isAuth, placeOrder);
orderRouter.get("/my-orders", isAuth, getMyOrders);
;

export default orderRouter;
