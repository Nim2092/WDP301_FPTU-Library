const User = require("../models/user.model");
const Role = require("../models/role.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// In-memory storage for refresh tokens (Consider using a database for scalability)
let refreshTokens = [];

const authController = {
  // REGISTER USER (For Librarian/Admin Registration)
  registerUser: async (req, res) => {
    try {
      const { username, email, password, fullName, phoneNumber } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Extract code from email
      const code = email.split("@")[0];

      // Assign role based on request or default to Librarian/Admin
      // Here, you might set role based on some condition or admin action
      // For simplicity, let's assume role is sent in the request body
      const { role } = req.body;

      // Validate role
      const validRoles = ["Librarian", "Admin"];
      if (!validRoles.includes(role)) {
        return res
          .status(400)
          .json({ message: "Invalid role for registration" });
      }

      const roleDoc = await Role.findOne({ name: role });
      if (!roleDoc) {
        return res
          .status(500)
          .json({ message: "Role not found in the database" });
      }

      // Create new user
      const newUser = new User({
        role_id: roleDoc._id,
        code,
        fullName,
        email,
        password: hashedPassword,
        phoneNumber,
        createdBy: req.user ? req.user.id : null, // If an admin is creating the user
      });

      // Save user to DB
      const user = await newUser.save();

      res.status(201).json({ message: "User registered successfully", user });
    } catch (err) {
      console.error("Registration Error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  // GENERATE ACCESS TOKEN
  generateAccessToken: (user) => {
    return jwt.sign(
      {
        id: user.id,
        role: user.role_id, // Store role ID in token
      },
      process.env.JWT_ACCESS_KEY,
      { expiresIn: "30m" } // Extended to 30 minutes
    );
  },

  // GENERATE REFRESH TOKEN
  generateRefreshToken: (user) => {
    return jwt.sign(
      {
        id: user.id,
        role: user.role_id, // Store role ID in token
      },
      process.env.JWT_REFRESH_KEY,
      { expiresIn: "365d" }
    );
  },

  // LOGIN USER (For Librarian/Admin Login)
  loginUser: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Find user by email
      const user = await User.findOne({ email }).populate("role_id");
      if (!user) {
        return res.status(404).json({ message: "Incorrect email or password" });
      }

      // Compare passwords
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(404).json({ message: "Incorrect email or password" });
      }

      // Check if role is Librarian or Admin
      const userRole = user.role_id.name;
      if (!["Librarian", "Admin"].includes(userRole)) {
        return res
          .status(403)
          .json({ message: "Access denied: Insufficient permissions" });
      }

      // Generate tokens
      const accessToken = authController.generateAccessToken(user);
      const refreshToken = authController.generateRefreshToken(user);
      refreshTokens.push(refreshToken);

      // Store refresh token in cookie
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Set to true in production
        path: "/",
        sameSite: "strict",
      });

      const { password: pwd, ...others } = user._doc;
      res.status(200).json({ ...others, accessToken, refreshToken });
    } catch (err) {
      console.error("Login Error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  // GOOGLE LOGIN
  loginWithGoogle: async (req, res) => {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: "Google token is required" });
    }

    try {
      // Verify the Google ID token
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      const email = payload.email;
      const fullName = payload.name || payload.email.split("@")[0];

      // Verify email domain
      if (!email.endsWith("@fpt.edu.vn") && !email.endsWith("@fe.edu.vn")) {
        return res.status(400).json({ message: "Email domain not allowed" });
      }

      // Extract code from email (part before '@')
      const code = email.split("@")[0];

      // Check if user exists
      let user = await User.findOne({ email }).populate("role_id");

      if (!user) {
        // Assign 'User' role
        const userRole = await Role.findOne({ name: "User" });
        if (!userRole) {
          return res.status(500).json({ message: "User role not found" });
        }

        // Create new user with 'User' role and a random password
        const randomPassword = bcrypt.hashSync(
          Math.random().toString(36).slice(-8),
          10
        );

        user = new User({
          role_id: userRole._id,
          code,
          fullName,
          email,
          password: randomPassword, // Assign a random password
          phoneNumber: null, // Optional
        });
        await user.save();
      }

      // Generate tokens
      const accessToken = authController.generateAccessToken(user);
      const refreshToken = authController.generateRefreshToken(user);
      refreshTokens.push(refreshToken);

      // Store refresh token in cookie
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Set to true in production
        path: "/",
        sameSite: "strict",
      });

      const { password, ...others } = user._doc;
      res.status(200).json({ ...others, accessToken, refreshToken });
    } catch (error) {
      console.error("Google Login Error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  // REQUEST REFRESH TOKEN
  requestRefreshToken: async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: "You're not authenticated" });
    }

    if (!refreshTokens.includes(refreshToken)) {
      return res.status(403).json({ message: "Refresh token is not valid" });
    }

    jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (err, user) => {
      if (err) {
        console.error("Refresh Token Error:", err);
        return res.status(403).json({ message: "Refresh token is not valid" });
      }

      // Remove old refresh token
      refreshTokens = refreshTokens.filter((token) => token !== refreshToken);

      // Generate new tokens
      const newAccessToken = authController.generateAccessToken(user);
      const newRefreshToken = authController.generateRefreshToken(user);
      refreshTokens.push(newRefreshToken);

      // Update refresh token in cookie
      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Set to true in production
        path: "/",
        sameSite: "strict",
      });

      res.status(200).json({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      });
    });
  },

  // LOG OUT
  logOut: async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token is required" });
    }

    refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
    res.clearCookie("refreshToken");
    res.status(200).json({ message: "Logged out successfully!" });
  },
};

module.exports = authController;
