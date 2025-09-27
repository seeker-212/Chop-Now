import express from 'express'
import isAuth from '../middleWares/isAuth.js'
import { upload } from '../middleWares/multer.js'
import { addItem, editItem, getItemById } from '../controllers/itemController.js'

const itemRouter = express.Router()

itemRouter.post("/add-item", isAuth, upload.single("image"), addItem)
itemRouter.post("/edit-item/:itemId", isAuth, upload.single("image"), editItem)
itemRouter.get("/get-by-id/:itemId", isAuth, getItemById)

export default itemRouter