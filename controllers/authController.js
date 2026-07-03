import User from "../models/User.js";
import bcrypt from "bcrypt";
import generateToken from "../utils/generateToken.js";

/**
 * REGISTER USER (Admin creates employees OR initial admin setup)
 */
export const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role, phone } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
      phone,
    });

    return res.status(201).json({
      id: user._id,
      name: user.firstName,
      role: user.role,
      token: generateToken(user._id, user.role),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * LOGIN USER
 */
export const loginUser = async (req, res) => {
  try {
    console.log("===== LOGIN START =====");
    console.log("Request Body:", req.body);

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    console.log("User Found:", user);

    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    console.log("Password Match:", isMatch);

    if (!isMatch) {
      return res.status(400).json({
        message: "Wrong password",
      });
    }

    user.lastLogin = new Date();
    await user.save();

    return res.json({
      id: user._id,
      name: user.firstName,
      role: user.role,
      token: generateToken(
        user._id,
        user.role
      ),
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: error.message,
    });
  }
};



export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user });
  } catch (err) {
    console.log("GET ME ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.firstName =
      req.body.firstName || user.firstName;

    user.lastName =
      req.body.lastName || user.lastName;

    user.email =
      req.body.email || user.email;

    user.phone =
      req.body.phone || user.phone;

    await user.save();

    res.json({
      success: true,
      user,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: err.message,
    });
  }
};

// IMAGE UPLOAD (simple version)
export const uploadProfileImage = async (
  req,
  res
) => {
  try {
    const imageUrl =
      "/uploads/" + req.file.filename;

    const user =
      await User.findByIdAndUpdate(
        req.user.id,
        {
          profileImage: imageUrl,
        },
        {
          new: true,
        }
      );

    res.json({
      success: true,
      user,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};