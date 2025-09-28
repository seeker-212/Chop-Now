import User from "../model/userModel.js";
import bcrypt from "bcryptjs";
import genToken from "../utils/token.js";
import { sendOtpMail } from "../utils/mail.js";

//------------ Sign Up Conntroller for the User ------------
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

    //HASING USER PASSWORD
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
    res.status(500).json(`Sign up error ${error}` || "Sign up error");
  }
};

// ------------- Sign In Conntroller for the User ------------
export const signIn = async (req, res) => {
  try {
    //Getting the data from the form body
    const { email, password } = req.body;
    const user = await User.findOne({ email }).populate("shop");

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

    // Strip password before sending
    const { password: _, ...userWithoutPassword } = user._doc;

    res.status(200).json(userWithoutPassword);
  } catch (error) {
    console.log(error);
    res.status(500).json(`Sign In error ${error}`);
  }
};

// ------------LogOut Controller ------------
export const signOut = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({ message: "log out successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json(`Sign Out error ${error}`);
  }
};

// ------------Password-Reset Controller------------
export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    // checking if user exists
    if (!user) {
      return res.status(400).json({ message: "User does not exist." });
    }

    // If user is avaliable then Generate Otp
    const otp = Math.floor(1000 + Math.random() + 9000).toString();
    user.resetOtp = otp;
    user.otpExpires = Date.now() + 5 * 60 * 1000;
    user.isOtpVerified = false;
    await user.save();
    await sendOtpMail(email, otp);

    return res.status(200).json({ message: "Otp sent successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json(`Send otp error ${error}`);
  }
};

// STILL UNDER PASSWORD RESET CONTROLLER ( otp verification)
export const verifyOtp = async (req, res) => {
  try {
    // Requesting otp from (form body)
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    //Checking if User email and otp is correct
    //Also checking if user inserted the otp before before the time expires
    if (!user || user.resetOtp !== otp || user.otpExpires < Date.now()) {
      res.status(400).json({ message: "invalid/expired OTP" });
    }

    // if everything correct then render this
    user.isOtpVerified = true;
    user.resetOtp = undefined;
    user.otpExpires = undefined;

    //Save user to the Database
    await user.save();

    return res.status(200).json({ message: "Otp verified Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json(`otp verification error ${error}`);
  }
};

//STILL UNDER PASSWORD RESET CONTROLLER (Password Reset)
export const resetPassword = async (req, res) => {
  try {
    //Requesting from form Data
    const { email, newPassword } = req.body;
    const user = await User.findOne({ email });

    // Checking if user exists and user has OTP
    if (!user || !user.isOtpVerified) {
      res.status(400).json({ message: "otp verfication required" });
    }

    //Then if user is verified
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;
    user.isOtpVerified = false;

    //Save user to db
    await user.save();

    return res.status(200).json({ message: "Password Reset Successfully." });
  } catch (error) {
    console.log(error);
    res.status(500).json(`Reset password error ${error}`);
  }
};

//Google Authentication Controller
export  const googleAuth = async (req, res) => {
  try {
     // Requesting data from form body
    const {fullName, email, mobile, role} = req.body
    let user = await User.findOne({email})

    // Checking if user exists
    if (!user) {
      user = await User.create({
        fullName,
        email,
        mobile,
        role
      })
    }

     const token = await genToken(user._id);
    res.cookie("token", token, {
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    // After account is created
    //Or is account is created successfully
    res.status(201).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: `Google signup error: ${error.message}` });
  }
}