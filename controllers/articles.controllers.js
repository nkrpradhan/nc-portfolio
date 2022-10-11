const {
  selectArticlesByID,
  updateArticleDataByID,
} = require("../models/articles.models");

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

module.exports = { getArticlesByID, updateArticlesByID };
