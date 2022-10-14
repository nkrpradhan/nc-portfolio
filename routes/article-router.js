const express = require("express");

const articleRouter = express.Router();

//Articles controllers
const {
  getArticles,
  getArticlesByID,
  updateArticlesByID,
} = require("../controllers/articles.controllers");

//Comments controllers
const {
  getCommentsByArticleID,
  postCommentsByArticleID,
} = require("../controllers/comments.controllers");

articleRouter.get("/", getArticles);

articleRouter.get("/:article_id", getArticlesByID);
articleRouter.get("/:article_id/comments", getCommentsByArticleID);
articleRouter.post("/:article_id/comments", postCommentsByArticleID);
articleRouter.patch("/:article_id", updateArticlesByID);

module.exports = articleRouter;
