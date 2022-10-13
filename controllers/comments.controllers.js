const {
  selectCommentsByArticleID,
  insertCommentsByArticleID,
} = require("../models/comments.models");

const getCommentsByArticleID = (req, res, next) => {
  const { article_id } = req.params;
  selectCommentsByArticleID(article_id)
    .then((comments) => res.send({ comments }))
    .catch((err) => next(err));
};

const postCommentsByArticleID = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;

  insertCommentsByArticleID({ article_id, username, body })
    .then((comment) => res.status(201).send({ comment }))
    .catch((err) => next(err));
};
module.exports = {
  getCommentsByArticleID,
  postCommentsByArticleID,
};
