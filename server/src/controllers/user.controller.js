const { default: mongoose } = require("mongoose");
const bcrypt = require("bcrypt");
const db = require("../models");
const { user: User, role: Role, order: Order } = db;
const { GridFSBucket } = require("mongodb");

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

//Get user by id
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

//Get user by role name
const getUserByRole = async (req, res, next) => {
  try {
    const { roleName } = req.params;
    const role = await Role.findOne({ name: roleName });
    if (!role) {
      return res.status(404).json({
        message: "Role not found",
        data: null,
      });
    }

    const user = await User.find({ role_id: role._id });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        data: null,
      });
    }

    res.status(200).json({
      message: "Get user by role successfully",
      data: user,
    });
  } catch (error) {
    console.error("Error getting user by role", error);
    res.status(500).send({ message: error.message });
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
    const image = req.file;

    if (!role_id || !code || !email || !password) {
      return res.status(400).json({
        message: "Data are required fields",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      role_id,
      code,
      fullName,
      email,
      password: hashedPassword,
      phoneNumber,
      isActive: true,
    });

    if (image) {
      // Sử dụng GridFS để lưu ảnh
      const bucket = new GridFSBucket(mongoose.connection.db, {
        bucketName: "uploads",
      });

      const uploadStream = bucket.openUploadStream(image.originalname);
      uploadStream.end(image.buffer);

      uploadStream.on("finish", async () => {
        user.image = `/user/image/${uploadStream.id}`; // Lưu đường dẫn ảnh
        await user.save();
        res.status(201).json({ message: "User created successfully", user });
      });

      uploadStream.on("error", (err) => {
        res.status(500).json({ message: "Error uploading image", error: err });
      });
    } else {
      await user.save();
      res.status(201).json({ message: "User created successfully", user });
    }
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

//Update user by id
const updateUserByAdmin = async (req, res) => {
  const { id } = req.params;
  const { role_id, fullName, email, phoneNumber, isActive } = req.body;
  const image = req.file;

  try {
    let user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (role_id) user.role_id = role_id;
    if (fullName) user.fullName = fullName;
    if (email) user.email = email;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (isActive !== undefined) user.isActive = isActive;

    if (image) {
      const bucket = new GridFSBucket(mongoose.connection.db, {
        bucketName: "uploads",
      });

      // Upload ảnh đại diện mới vào GridFS
      const uploadStream = bucket.openUploadStream(image.originalname);
      uploadStream.end(image.buffer);

      uploadStream.on("finish", async () => {
        user.image = `/user/image/${uploadStream.id}`; // Cập nhật đường dẫn ảnh
        await user.save();
        res.status(200).json({
          message: "User updated successfully",
          user,
        });
      });

      uploadStream.on("error", (err) => {
        res.status(500).json({ message: "Error uploading image", error: err });
      });
    } else {
      await user.save();
      res.status(200).json({
        message: "User updated successfully",
        user,
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error });
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
    const { fullName, phoneNumber } = req.body;
    const image = req.file;

    let user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (fullName) user.fullName = fullName;
    if (phoneNumber) user.phoneNumber = phoneNumber;

    if (image) {
      const bucket = new GridFSBucket(mongoose.connection.db, {
        bucketName: "uploads",
      });

      const uploadStream = bucket.openUploadStream(image.originalname);
      uploadStream.end(image.buffer);

      uploadStream.on("finish", async () => {
        user.image = `/user/image/${uploadStream.id}`; // Cập nhật đường dẫn ảnh
        await user.save();
        res.status(200).json({ message: "User updated successfully", user });
      });

      uploadStream.on("error", (err) => {
        res.status(500).json({ message: "Error uploading image", error: err });
      });
    } else {
      await user.save();
      res.status(200).json({ message: "User updated successfully", user });
    }
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

// Activate/Deactivate User
const activateDeactivateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        data: null,
      });
    }
    user.isActive = !user.isActive;
    const updatedUser = await user.save();
    res.status(200).json({
      message: "User status updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user status", error);
    res.status(500).send({ message: error.message });
  }
};

// Search user
const searchUser = async (req, res, next) => {
  try {
    const { searchKey } = req.query;
    const trimSearchKey = searchKey.trim();
    const user = await User.find({
      $or: [
        { code: { $regex: trimSearchKey, $options: "i" } },
        { fullName: { $regex: trimSearchKey, $options: "i" } },
        { email: { $regex: trimSearchKey, $options: "i" } },
      ],
    });

    if (!user) {
      return res.status(404).json({
        message: "No user found",
        data: null,
      });
    }

    res.status(200).json({
      message: "Search user successfully",
      data: user,
    });
  } catch (error) {
    console.error("Error searching user", error);
    res.status(500).send({ message: error.message });
  }
};

//Assign Role
const assignRole = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const { roleId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        data: null,
      });
    }

    user.role_id = roleId;
    const updatedUser = await user.save();

    const role = await Role.findById(roleId);

    res.status(200).json({
      message: "Role assigned successfully",
      data: {
        user: updatedUser,
        role: role ? role.name : null,
      },
    });
  } catch (error) {
    console.error("Error assigning role", error);
    res.status(500).send({ message: error.message });
  }
};

//get image by id
const getImageById = async (req, res) => {
  const { id } = req.params;

  try {
    const bucket = new GridFSBucket(mongoose.connection.db, {
      bucketName: "uploads",
    });

    const downloadStream = bucket.openDownloadStream(
      new mongoose.Types.ObjectId(id)
    );

    downloadStream.on("error", (err) => {
      res.status(404).json({ message: "Image not found", error: err });
    });

    downloadStream.pipe(res);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving image", error });
  }
};

const UserController = {
  viewProfile,
  editProfile,
  deleteUserById,
  getAllUser,
  getUserById,
  getUserByRole,
  addNewUser,
  changePassword,
  activateDeactivateUser,
  searchUser,
  assignRole,
  updateUserByAdmin,
  getImageById,
};
module.exports = UserController;
