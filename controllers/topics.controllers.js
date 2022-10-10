const { selectTopics } = require("../models/topics.models");

const getTopics = (req, res, next) => {
  selectTopics()
    .then((topics) => {
      res.send({ topics });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = { getTopics };
