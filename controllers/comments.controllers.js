const { selectCommentsByArticleID } = require("../models/comments.models");

const getCommentsByArticleID = (req, res, next) => {
  const { article_id } = req.params;
  selectCommentsByArticleID(article_id)
    .then((comments) => res.send({ comments }))
    .catch((err) => next(err));
};
module.exports = {
  getCommentsByArticleID,
};
