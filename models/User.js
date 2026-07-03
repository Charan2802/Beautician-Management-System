import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },

    lastName: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["Admin", "Employee"],
      default: "Employee",
    },

    phone: {
      type: String,
      default: "",
    },

    profileImage: {
      type: String,
      default: "",
    },

    accountStatus: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },

    lastLogin: Date,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);