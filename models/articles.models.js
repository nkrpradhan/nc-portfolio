const db = require("../db/connection");

exports.selectArticles = (topic, sort_by = "created_at", order = "desc") => {
  if (
    ![
      "author",
      "title",
      "article_id",
      "topic",
      "created_at",
      "votes",
      "comment_count",
    ].includes(sort_by)
  ) {
    return Promise.reject({ status: 400, msg: "Invalid sort query" });
  }

  if (!["asc", "desc"].includes(order.toLowerCase())) {
    return Promise.reject({ status: 400, msg: "Invalid order query" });
  }

  let selectQuery = `SELECT 
  u.name AS author, ar.title, ar.article_id, ar.topic, ar.created_at, ar.votes, COUNT(c.*) ::INT AS comment_count 
  FROM articles ar 
  JOIN users u ON ar.author=u.username 
  JOIN comments c ON ar.article_id=c.article_id 
  GROUP BY u.name, ar.title, ar.article_id, ar.body, ar.topic, ar.created_at, ar.votes 
  ORDER BY ${sort_by} ${order}`;

  if (topic !== undefined) {
    selectQuery = {
      text: `SELECT 
    u.name AS author, ar.title, ar.article_id, ar.topic, ar.created_at, ar.votes, COUNT(c.*) ::INT AS comment_count 
    FROM articles ar 
    JOIN users u ON ar.author=u.username 
    JOIN comments c ON ar.article_id=c.article_id 
    WHERE ar.topic=$1 
    GROUP BY u.name, ar.title, ar.article_id, ar.body, ar.topic, ar.created_at, ar.votes 
    ORDER BY ${sort_by} ${order}`,
      values: [topic],
    };
  }

  return db
    .query(selectQuery)
    .then(({ rows: articles }) =>
      articles.length > 0
        ? articles
        : Promise.reject({ status: 404, msg: "Articles not found" })
    );
};

exports.selectArticlesByID = (article_id) => {
  return db
    .query(
      `SELECT u.name AS author, ar.title, ar.article_id, ar.body, ar.topic, ar.created_at, ar.votes,count(c.*) ::INT AS comment_count 
      FROM articles ar LEFT JOIN users u 
      ON ar.author=u.username LEFT JOIN comments c 
      ON ar.article_id=c.article_id 
      WHERE ar.article_id=$1 
      GROUP BY u.name, ar.title, ar.article_id, ar.body, ar.topic, ar.created_at, ar.votes
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
