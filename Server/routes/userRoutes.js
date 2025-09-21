import express from 'express'
import { getCurrentUser } from '../controllers/userController.js';
import isAuth from '../middleWares/isAuth.js';


const userRouter = express.Router()

userRouter.get('/current-user', isAuth, getCurrentUser)

export default userRouter;