const { default: mongoose } = require("mongoose");
const db = require("../models");
const { user: User, news: News } = db;
const { GridFSBucket } = require("mongodb");

//list news
async function listNews(req, res, next) {
  try {
    const listNews = await News.find();

    if (!listNews) {
      return res.status(404).send({ message: "News not found" });
    }
    const newListNews = listNews.map((news) => ({
      id: news.id,
      title: news.title,
      content: news.content,
      thumbnail: news.thumbnail,
      createdBy: news.createdBy,
      updatedBy: news.updatedBy,
    }));
    res.status(200).json({
      message: "Get list news successfully",
      data: newListNews,
    });
  } catch (error) {
    close.error("Error listing news", error);
    res.status(500).send({ message: error.message });
  }
}

//get news by id
async function getNewsDetailById(req, res, next) {
  try {
    const { id } = req.params;
    const news = await News.findById(id);
    if (!news) {
      return res.status(404).send({ message: "News not found" });
    }
    res.status(200).json({
      message: "Get news successfully",
      data: news,
    });
  } catch (error) {
    console.error("Error getting news", error);
    res.status(500).send({ message: error.message });
  }
}

//create a news
async function createNews(req, res, next) {
  try {
    const { title, content, createdBy, updatedBy } = req.body;
    const thumbnail = req.file;
    if (!title || !content || !thumbnail) {
      return res
        .status(400)
        .send({ message: "Title, content and thumbnail are required" });
    }

    // Kết nối tới GridFSBucket
    const bucket = new GridFSBucket(mongoose.connection.db, {
      bucketName: "uploads",
    });

    // Upload file vào GridFS
    const uploadStream = bucket.openUploadStream(thumbnail.originalname);
    uploadStream.end(thumbnail.buffer);

    uploadStream.on("finish", async () => {
      try {
        // Tạo một bài viết mới
        const newNews = new News({
          title: title,
          content: content,
          thumbnail: `/uploads/${uploadStream.id}`,
          //   createdBy: req.user.id,
          //   updatedBy: req.user.id,
          createdBy: createdBy,
          updatedBy: updatedBy,
        });

        // Lưu bài viết vào MongoDB
        const savedNews = await newNews.save();

        // Trả về kết quả
        res.status(201).json({
          message: "News added successfully",
          news: savedNews,
        });
      } catch (error) {
        res.status(500).json({
          message: "Error saving news",
          error,
        });
      }
    });

    uploadStream.on("error", (err) => {
      res.status(500).json({
        message: "Error uploading thumbnail",
        error: err,
      });
    });
  } catch (error) {
    console.error("Error creating news", error);
    res.status(500).send({ message: error.message });
  }
}

//update a news with id
async function updateNews(req, res, next) {
  try {
    const { id } = req.params;
    const { title, content, updatedBy } = req.body;
    const thumbnail = req.file;

    if (!title || !content || !thumbnail) {
      return res
        .status(400)
        .send({ message: "Title, content and thumbnail are required" });
    }
    const news = await News.findById(id);
    if (!news) {
      return res.status(404).send({ message: "News not found" });
    }

    if (title) news.title = title;
    if (content) news.content = content;
    if (updatedBy) news.updatedBy = updatedBy;
    // news.updatedBy = req.user.id;

    if (thumbnail) {
      const bucket = new GridFSBucket(mongoose.connection.db, {
        bucketName: "uploads",
      });

      // Upload ảnh mới vào GridFS
      const uploadStream = bucket.openUploadStream(thumbnail.originalname);
      uploadStream.end(thumbnail.buffer);

      // Khi hoàn thành upload ảnh mới, cập nhật thumbnail
      uploadStream.on("finish", async () => {
        // Cập nhật đường dẫn thumbnail
        news.thumbnail = `/uploads/${uploadStream.id}`;

        // Lưu bài viết sau khi cập nhật
        await news.save();

        res.status(200).json({
          message: "News updated successfully",
          news,
        });
      });

      uploadStream.on("error", (err) => {
        res
          .status(500)
          .json({ message: "Error uploading new thumbnail", error: err });
      });
    } else {
      // Nếu không có ảnh mới, chỉ lưu lại title và content
      await news.save();
      res.status(200).json({
        message: "News updated successfully",
        news,
      });
    }
  } catch (error) {
    console.error("Error updating news", error);
    res.status(500).send({ message: error.message });
  }
}

//delete a news with id
async function deleteNews(req, res, next) {
  try {
    const { id } = req.params;
    const news = await News.findByIdAndDelete(id);
    if (!news) {
      return res.status(404).send({ message: "News not found" });
    }
    res.status(200).json({
      message: "News deleted successfully",
      data: news,
    });
  } catch (error) {
    console.error("Error deleting news", error);
    res.status(500).send({ message: error.message });
  }
}

//get thumbnail by news id
async function getThumbnailByNewsId(req, res, next) {
  const { newsId } = req.params;
  try {
    const news = await News.findById(newsId);
    if (!news) {
      return res.status(404).json({ message: "News not found" });
    }

    // Kiểm tra xem news.thumbnail có chứa ObjectId hay là một URL có ObjectId
    let thumbnailId;

    if (news.thumbnail.includes("/")) {
      thumbnailId = news.thumbnail.split("/").pop();
    } else {
      thumbnailId = news.thumbnail;
    }

    const bucket = new GridFSBucket(mongoose.connection.db, {
      bucketName: "uploads",
    });

    const downloadStream = bucket.openDownloadStream(
      new mongoose.Types.ObjectId(thumbnailId)
    );

    downloadStream.on("error", (err) => {
      res.status(404).json({ message: "Image not found", error: err });
    });

    downloadStream.pipe(res);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving image", error });
  }
}
const NewsController = {
  listNews,
  createNews,
  updateNews,
  deleteNews,
  getNewsDetailById,
  getThumbnailByNewsId,
};
module.exports = NewsController;
