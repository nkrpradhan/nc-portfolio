const {
  selectArticles,
  selectArticlesByID,
  selectCommentsByArticleID,
  updateArticleDataByID,
} = require("../models/articles.models");

const getArticles = (req, res, next) => {
  const { topic, sort_by, order } = req.query;
  selectArticles(topic, sort_by, order)
    .then((articles) => res.send({ articles }))
    .catch((err) => next(err));
};

const getArticlesByID = (req, res, next) => {
  const { article_id } = req.params;

  selectArticlesByID(article_id)
    .then((article) => {
      res.send({ article });
    })
    .catch((err) => next(err));
};

const updateArticlesByID = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;

  updateArticleDataByID({ inc_votes, article_id })
    .then((article) => res.status(201).send({ article }))
    .catch((err) => next(err));
};

module.exports = {
  getArticles,
  getArticlesByID,
  updateArticlesByID,
};
