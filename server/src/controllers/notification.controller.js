const { default: mongoose } = require("mongoose");
const db = require("../models");
const { user: User, order: Order, role: Role, notification: Notification } = db;

//get all notifications
const getAllNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    res.status(200).json({
      message: "Get all notifications successfully",
      data: notifications,
    });
  } catch (error) {
    res.status(500).json({
      message: "Unable to get notifications",
      error: error.message,
    });
  }
};

// Create and Save a new Notification
const createNotification = async (req, res, next) => {
  try {
    const { userId, orderId, type, message } = req.body;

    if (!userId || !type || !message) {
      return res.status(400).json({
        success: false,
        message: "userId, type, and message are required",
      });
    }

    const notification = new Notification({
      userId,
      orderId,
      type,
      message,
    });

    await notification.save();
    res.status(201).json({
      message: "Tạo thông báo thành công",
      data: notification,
    });
  } catch (error) {
    res.status(500).json({
      message: "Không thể tạo thông báo",
      error: error.message,
    });
  }
};

//get notifications by user id
const getNotificationsByUserId = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const notifications = await Notification.find({ userId }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      message: "Get notifications by user id successfully",
      data: notifications,
    });
  } catch (error) {
    res.status(500).json({
      message: "Unable to get notifications",
      error: error.message,
    });
  }
};

//delete notification by id
const deleteNotification = async (req, res, next) => {
  try {
    const id = req.params.id;
    const notification = await Notification.findByIdAndDelete(id);
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy thông báo",
      });
    }
    res.status(200).json({
      message: "Xóa thông báo thành công",
      data: notification,
    });
  } catch (error) {
    res.status(500).json({
      message: "Unable to delete notification",
      error: error.message,
    });
  }
};

//count number notifications unread by user id
const getUnreadNotificationsByUserId = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const unreadCount = await Notification.countDocuments({
      userId,
      isRead: false,
    });
    res.status(200).json({
      message: "Count unread notifications by user id successfully",
      data: unreadCount,
    });
  } catch (error) {
    res.status(500).json({
      message: "Unable to get notifications",
      error: error.message,
    });
  }
};

//mark notification as read by user id
const markNotificationAsRead = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const notification = await Notification.updateMany(
      { userId, isRead: false },
      { isRead: true }
    );
    if (!notification) {
      return res.status(404).json({
        message: "Không tìm thấy thông báo",
        data: null,
      });
    }
    res.status(200).json({
      message: "Đã đánh dấu tất cả thông báo là đã đọc",
      data: notification,
    });
  } catch (error) {
    res.status(500).json({
      message: "Unable to mark notifications as read",
      error: error.message,
    });
  }
};

const notificationController = {
  createNotification,
  getNotificationsByUserId,
  getAllNotifications,
  deleteNotification,
  getUnreadNotificationsByUserId,
  markNotificationAsRead,
};
module.exports = notificationController;
