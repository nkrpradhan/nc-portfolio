const db = require("../db/connection");

exports.selectArticlesByID = (article_id) => {
  return db
    .query(
      " select u.name as author, ar.title, ar.article_id, ar.body, ar.topic, ar.created_at, ar.votes from articles ar join users u on ar.author=u.username where ar.article_id=$1",
      [article_id]
    )
    .then(({ rows: [article] }) => {
      if (article === undefined) {
        return Promise.reject({ status: 404, msg: "Id not found" });
      }
      return article;
    });
};
