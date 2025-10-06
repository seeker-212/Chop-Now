import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
    },
    mobile: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ["user", "owner", "ChopNowRider"],
      default: "user",
      required: true,
    },
    resetOtp: {
      type: String,
    },
    isOtpVerified: {
      type: Boolean,
      default: false,
    },
    otpExpires: {
      type: Date,
    },
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
    },
    location: {
      type:{type: String, enum: ['point'], default: 'point'},
      coordinates: {type: [Number], default: [0,0]}
    }
  },
  { timestamps: true }
);

userSchema.index({location: '2dsphere'})

const User = mongoose.model("User", userSchema);

export default User;
