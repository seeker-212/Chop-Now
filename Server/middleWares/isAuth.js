import jwt from "jsonwebtoken";

// This Function will make you stayed Login if the token is available
const isAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    // Checking if token is available
    if (!token) {
      return res
        .status(401)
        .json({ message: "Authentication token not found" });
    }

    try {
      const decodeToken = jwt.verify(token, process.env.JWT_SECRET);
      req.userId = decodeToken.userId;

      next();
    } catch (err) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Auth Error" });
  }
};

export default isAuth;
