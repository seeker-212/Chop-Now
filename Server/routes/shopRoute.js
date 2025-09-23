import express from 'express'
import isAuth from '../middleWares/isAuth.js'
import { createEditShop } from '../controllers/shopController.js'

const shopRouter = express.Router()

shopRouter.get("/create-edit", isAuth, createEditShop)

export default shopRouter