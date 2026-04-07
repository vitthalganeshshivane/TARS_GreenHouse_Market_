import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import OTP from "../models/Otp.js";
import { generateOTP } from "../utils/generateOTP.js";
import { sendEmail } from "../utils/sendEmail.js";

// generate jwt
const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

const isMatch = (user, password) => {
  return bcrypt.compare(password, user.password);
};

// signup
export const signup = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const normalizedEmail = email.toLowerCase();

    const otpRecord = await OTP.findOne({ email: normalizedEmail });

    if (!otpRecord || !otpRecord.isVerified) {
      return res.status(400).json({
        message: "Please verify OTP first",
      });
    }

    if (otpRecord.expiresAt < Date.now()) {
      return res.status(400).json({
        message: "OTP expired, please request again",
      });
    }

    const query = phone
      ? { $or: [{ email: normalizedEmail }, { phone }] }
      : { email: normalizedEmail };

    const existingUser = await User.findOne(query);

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPass = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email: normalizedEmail,
      password: hashedPass,
      phone,
      isVerified: true,
    });

    await OTP.deleteOne({ email: normalizedEmail });

    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// login
export const login = async (req, res) => {
  try {
    const { email, phone, password } = req.body;

    // ✅ backend validation (this is what actually matters)
    if ((!email && !phone) || !password) {
      return res.status(400).json({
        message: "Provide email or phone and password",
      });
    }

    const query = email ? { email } : { phone };

    const user = await User.findOne(query);

    // ✅ FIX: handle user not found
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await isMatch(user, password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user);

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const sendOtpController = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const normalizedEmail = email.toLowerCase();

    const otp = generateOTP();

    await OTP.findOneAndUpdate(
      { email: normalizedEmail },
      {
        email: normalizedEmail,
        otp,
        isVerified: false, // reset verification on resend
        expiresAt: Date.now() + 5 * 60 * 1000,
      },
      { upsert: true, new: true },
    );

    await sendEmail(normalizedEmail, "Your OTP Code", `Your OTP is ${otp}`);

    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const verifyOtpController = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        message: "Email and OTP are required",
      });
    }

    const normalizedEmail = email.toLowerCase();

    const existingOtp = await OTP.findOne({ email: normalizedEmail });

    if (!existingOtp) {
      return res.status(400).json({ message: "OTP not found" });
    }

    if (existingOtp.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (existingOtp.expiresAt < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    // ✅ Mark verified instead of deleting (better flow)
    existingOtp.isVerified = true;
    await existingOtp.save();

    res.status(200).json({
      success: true,
      message: "OTP verified successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
