import jwt from 'jsonwebtoken'


// This Function will make you stayed Login if the token is available
const isAuth = async (req, res, next) => {
    try {
        const token = req.cookies.token

        // Checking if token is available
        if(!token){
            return res.status(400).json({message: "token not found"})
        }

        //
        const decodeToken = jwt.verify(token, process.env.JWT_SECRET)
        if (!decodeToken) {
            return res.status(400).json({message: "token not verified"})
        }
    

        req.userId = decodeToken.userId
        next()
    } catch (error) {
        return res.status(500).json({message: 'Auth Error'})
    }
}

export default isAuth;