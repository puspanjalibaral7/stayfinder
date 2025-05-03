import { response } from "express";
import { User } from "../models/userSchema.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
  console.log("Signup endpoint hit");
  try {
    const { firstName, lastName, email, phone, password, role } = req.body;

    console.log("Signup request received:", { firstName, lastName, email, phone, role });

    if (!['user', 'admin'].includes(role)) {
      console.log("Invalid role:", role);
      return res.status(400).json({ message: "Invalid role selected" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("User already exists with email:", email);
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({ firstName, lastName, phone, email, password: hashedPassword, role });
    await newUser.save();

    console.log("User registered successfully:", newUser);
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Signup error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const users = await User.find({}, "-password");
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const signin = async (req, res) => {
  console.log("Signin endpoint hit");
  try {
    const { email, password, role } = req.body;

    console.log("Signin request received:", { email, role });

    if (!['user', 'admin'].includes(role)) {
      console.log("Invalid role:", role);
      return res.status(400).json({ message: "Invalid role selected" });
    }

    const user = await User.findOne({ email, role });
    if (!user) {
      console.log("User not found:", email);
      return res.status(400).json({ message: "Invalid email or role" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Password mismatch for user:", email);
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    res.status(200).json({ message: "Login successful", token, admin: user.role === "admin" });
  } catch (error) {
    console.error("Signin error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: "Access denied. No token provided." });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = user;
    next();
  });
};

export const authorizeAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  next();
};

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000/api/v1'}/auth/signin`,
      {
        email: formData.email,
        password: formData.password,
        role: formData.role,
      }
    );

    if (response) {
      toast.success("Successfully Logged In!");
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userId", response.data.userId); 
      localStorage.setItem("isAdmin", response.data.admin);
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    }
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      toast.error(err.response.data?.message || "Login failed");
    } else {
      toast.error("An unexpected error occurred");
    }
  }
};


