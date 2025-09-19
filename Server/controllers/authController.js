import User from "../model/userModel.js";
import bcrypt from "bcryptjs";
import genToken from "../utils/token.js";

//Sign Up Conntroller for the User
export const signUp = async (req, res) => {
  try {
    //Getting the data from the form body
    const { fullName, email, password, mobile, role } = req.body;
    let user = await User.findOne({ email });

    //Checking if User Already Exist
    if (user) {
      return res.status(400).json({ message: "User already Exist." });
    }

    //Making sure password is safe to use
    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters" });
    }

    //Making sure phone number is valid
    if (mobile.length < 11) {
      return res
        .status(400)
        .json({ message: " Phone number must be at least 11 digits." });
    }

    //------------HASING USER PASSWORD -------------
    const hashedPassword = await bcrypt.hash(password, 12);

    //Once everything is done then create User
    user = await User.create({
      fullName,
      email,
      mobile,
      password: hashedPassword,
      role,
    });

    const token = await genToken(user._id);
    res.cookie("token", token, {
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 1000,
      httpOnly: true,
    });

    // After account is created
    //Or is account is created successfully
    res.status(201).json(user);
  } catch (error) {
    console.log(error);
    res.status(400).json(`Sign up error ${error}` || "Sign up error");
  }
};

//Sign Up Conntroller for the User
export const signIn = async (req, res) => {
  try {
    //Getting the data from the form body
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    //Checking if User does not Exist
    if (!user) {
      return res.status(400).json({ message: "User does not exist." });
    }

    //Checking if the gotten data is a match
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: "Incorrect Password" });
    }

    // Using the token to stay logged in
    const token = await genToken(user._id);
    res.cookie("token", token, {
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 1000,
      httpOnly: true,
    });

    // Send user without password
    const { password: _, ...userWithoutPassword } = user._doc;

    res.status(200).json(userWithoutPassword);
  } catch (error) {
    console.log(error);
    res.status(400).json(`Sign In error ${error}`);
  }
};

export const signOut = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({ message: "log out successfully" });
  } catch (error) {
    console.log(error);
    res.status(400).json(`Sign Out error ${error}`);
  }
};
