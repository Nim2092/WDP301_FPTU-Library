const { default: mongoose } = require("mongoose");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const db = require("../models");
const { user: User, role: Role, order: Order } = db;

//Get all user
const getAllUser = async (req, res, next) => {
  try {
    const user = await User.find({});

    if (!user) {
      return res.status(404).json({
        message: "Get all user failed",
        data: null,
      });
    }

    res.status(200).json({
      message: "Get all user successfully",
      data: user,
    });
  } catch (error) {
    console.error("Error listing user", error);
    res.status(500).send({ message: error.message });
  }
};

//get user by id
const getUserById = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    console.log(user);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        data: null,
      });
    }

    res.status(200).json({
      message: "Get user successfully",
      data: user,
    });
  } catch (error) {
    console.error("Error getting a user", error);
    res.status(500).send({ message: error.message });
  }
};

//get user by role id
const getUserByRole = async (req, res, next) => {
  try {
    const { roleId } = req.params;

    const role = await Role.findById(roleId);
    if (!role) {
      return res.status(404).json({ message: "Role not found", data: null });
    }

    const users = await User.find({ role_id: role._id }).populate("role_id");

    if (!users || users.length === 0) {
      return res.status(404).json({
        message: "No users found with this role",
        data: null,
      });
    }
    res.status(200).json({
      message: "Users found successfully",
      data: users,
    });
  } catch (error) {
    console.error("Error in getUserByRole:", error);
    res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
};

// Delete user by id
async function deleteUserById(req, res, next) {
  try {
    const { userId } = req.params;
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "Delete user successfully" });
  } catch (error) {
    console.error("Error deleting user", error);
    res.status(500).send({ message: error.message });
  }
}

//Add new user
const addNewUser = async (req, res, next) => {
  try {
    const { role_id, code, fullName, email, password, phoneNumber } = req.body;

    if (!role_id || !code || !email || !password) {
      return res.status(400).json({
        message: "Data are required fields",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      role_id,
      code,
      fullName,
      email,
      password: hashedPassword,
      phoneNumber,
    });

    const savedUser = await newUser.save();

    res.status(201).json({
      message: "User created successfully",
      data: savedUser,
    });
  } catch (error) {
    if (error.code === 11000) {
      const duplicateField = Object.keys(error.keyPattern)[0];
      return res.status(409).json({
        message: `Duplicate ${duplicateField} error`,
        error: error.message,
      });
    }

    console.error("Error in addNewUser:", error);
    res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
    next(error);
  }
};

// View user profile
const viewProfile = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        data: null,
      });
    }

    res.status(200).json({
      message: "Get user profile successfully",
      data: user,
    });
  } catch (error) {
    console.error("Error getting user profile", error);
    res.status(500).send({ message: error.message });
  }
};

// Edit user profile
const editProfile = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedData = {
      fullName: req.body.fullName,
      phoneNumber: req.body.phoneNumber,
    };
    const updatedUser = await User.findByIdAndUpdate(id, updatedData, {
      new: true,
    });
    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found",
        data: null,
      });
    }

    res.status(200).json({
      message: "Update user profile successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user profile", error);
    res.status(500).send({ message: error.message });
  }
};

//change user password
const changePassword = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        data: null,
      });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Old password is incorrect",
      });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    const newPass = await user.save();

    res.status(200).json({
      message: "Change password successfully",
      data: newPass,
    });
  } catch (error) {
    console.error("Error changing password", error);
    res.status(500).send({ message: error.message });
  }
};

//forgot password
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        data: null,
      });
    }

    // Create reset token
    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

    await user.save();

    // NodeMailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "titi2024hd@gmail.com", // Email
        pass: "mrwm vfbp dprc qwyu", // App password
      },
    });

    // Email content
    const mailOptions = {
      from: "titi2024hd@gmail.com",
      to: user.email,
      subject: "FPTU Library - Password Reset Request",
      text: `Dear ${user.fullName},\n\n
      We received a request to reset the password for your FPTU Library account. If you initiated this request, please follow the link below to set a new password:\n\n
      http://localhost:3000/api/user/reset-password/${resetToken}\n\n
      This link will expire in 1 hour. If you did not request a password reset, please ignore this email, and no changes will be made to your account.\n\n
      If you have any questions, feel free to contact our support team.\n\n
      Best regards,\n
      FPTU Library Team`,
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({
          message: "Error sending email",
          error: error.message,
        });
      }
      console.log("Email sent: " + info.response);
      res.status(200).json({
        message: "Email sent to reset password",
      });
    });
  } catch (error) {
    console.error("Error in forgotPassword:", error);
    res.status(500).send({ message: error.message });
  }
};

//reset password
const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }, // Kiểm tra token còn hạn
    });

    if (!user) {
      return res.status(400).json({
        message: "Reset token is invalid or has expired",
      });
    }

    // Hash new password before saving
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    // Delete reset token and expiry date
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({
      message: "Password has been reset successfully",
    });
  } catch (error) {
    console.error("Error in resetPassword:", error);
    res.status(500).send({ message: error.message });
  }
};

//Get user orders by user id (book_id, created_by, updated_by)
const getUserOrders = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const order = await Order.find({
      $or: [{ created_by: userId }, { updated_by: userId }],
    })
      .populate("book_id")
      .populate("created_by")
      .populate("updated_by");

    if (!order || order.length === 0) {
      return res.status(404).json({
        message: "No order found for this user!",
        data: null,
      });
    }

    res.status(200).json({
      message: "Order found successfully",
      data: order,
    });
  } catch (error) {
    console.error("Error in getUserOrder:", error);
    res.status(500).json({
      message: "An error occurred",
      error: error.message,
    });
    next(error);
  }
};
const updateUserBookings = async (req, res, next) => {
  try {
    const { bookingId } = req.params;
    const updatedData = req.body;

    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      updatedData,
      { new: true }
    ).populate("scheduleId");

    if (!updatedBooking) {
      return res.status(404).json({ message: "Booking not found", data: null });
    }

    res
      .status(200)
      .json({ message: "Booking updated successfully", data: updatedBooking });
  } catch (error) {
    console.error("Error in updateUserBookings:", error);
    res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
    next(error);
  }
};
const getUserAllBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({}).populate("scheduleId");

    if (bookings.length === 0) {
      return res
        .status(404)
        .json({ message: "No bookings found for this user", data: null });
    }

    res
      .status(200)
      .json({ message: "Bookings found successfully", data: bookings });
  } catch (error) {
    console.error("Error in getUserBookings:", error);
    res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
    next(error);
  }
};

async function list(req, res, next) {
  try {
    const list = await User.find();
    const newList = list.map((r) => ({
      _id: r._id,
      username: r.username,
      email: r.email,
      fullName: r.fullName,
      phoneNumber: r.phoneNumber,
      address: r.address,
    }));
    res.status(200).json(newList);
  } catch (error) {
    next(error);
  }
}

const UserController = {
  viewProfile,
  editProfile,
  list,
  deleteUserById,
  getAllUser,
  getUserById,
  getUserByRole,
  getUserOrders,
  getUserAllBookings,
  updateUserBookings,
  addNewUser,
  changePassword,
  forgotPassword,
  resetPassword,
};
module.exports = UserController;
