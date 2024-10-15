const { default: mongoose } = require("mongoose");
const db = require("../models");
const { user: User, news: News } = db;

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
    const { title, content, thumbnail, createdBy, updatedBy } = req.body;
    if (!title || !content || !thumbnail) {
      return res
        .status(400)
        .send({ message: "Title, content and thumbnail are required" });
    }
    const news = new News({
      title: title,
      content: title,
      thumbnail: thumbnail,
      //   createdBy: req.user.id,
      //   updatedBy: req.user.id,
      createdBy: createdBy,
      updatedBy: updatedBy,
    });
    const savedNews = await news.save();
    res.status(201).json({
      message: "News created successfully",
      data: savedNews,
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
    const { title, content, thumbnail, updatedBy } = req.body;

    if (!title || !content || !thumbnail) {
      return res
        .status(400)
        .send({ message: "Title, content and thumbnail are required" });
    }

    const news = await News.findByIdAndUpdate(
      id,
      { title, content, thumbnail, updatedBy: /* req.user.id */ updatedBy },
      { new: true }
    );
    if (!news) {
      return res.status(404).send({ message: "News not found" });
    }
    res.status(200).json({
      message: "News updated successfully",
      data: news,
    });
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
const NewsController = {
  listNews,
  createNews,
  updateNews,
  deleteNews,
  getNewsDetailById,
};
module.exports = NewsController;
