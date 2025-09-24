import express from 'express'
import isAuth from '../middleWares/isAuth.js'
import { createEditShop, getMyShop } from '../controllers/shopController.js'
import { upload } from '../middleWares/multer.js'

const shopRouter = express.Router()

shopRouter.post("/create-edit", isAuth, upload.single("image"), createEditShop)
shopRouter.get("/get-shop", isAuth, getMyShop)


export default shopRouter