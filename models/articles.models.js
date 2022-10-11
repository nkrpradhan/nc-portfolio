const db = require("../db/connection");

exports.selectArticlesByID = (article_id) => {
  return db
    .query(
      `select u.name as author, ar.title, ar.article_id, ar.body, ar.topic, ar.created_at, ar.votes,count(c.*) ::INT as comment_count from articles ar join users u on ar.author=u.username join comments c on ar.article_id=c.article_id where ar.article_id=$1 GROUP by u.name, ar.title, ar.article_id, ar.body, ar.topic, ar.created_at, ar.votes
      `,
      [article_id]
    )
    .then(({ rows: [article] }) =>
      article !== undefined
        ? article
        : Promise.reject({ status: 404, msg: "Id not found" })
    );
};

exports.updateArticleDataByID = ({ inc_votes, article_id }) => {
  return db
    .query(
      "update articles set votes = votes + $1 where article_id=$2 returning *",
      [inc_votes, article_id]
    )
    .then(({ rows: [article] }) =>
      article !== undefined
        ? article
        : Promise.reject({ status: 404, msg: "Id not found" })
    );
};
