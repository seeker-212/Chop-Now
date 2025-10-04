import express from "express"
import isAuth from "../middleWares/isAuth.js"
import { placeOrder } from "../controllers/orderController.js"

const orderRouter = express.Router()

orderRouter.post('/place-order', isAuth, placeOrder)


export default orderRouter