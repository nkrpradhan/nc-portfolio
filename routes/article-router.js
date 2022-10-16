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

articleRouter
  .route("/:article_id")
  .get(getArticlesByID)
  .patch(updateArticlesByID);
articleRouter
  .route("/:article_id/comments")
  .get(getCommentsByArticleID)
  .post(postCommentsByArticleID);

module.exports = articleRouter;
