const db = require("../db/connection");
const { selectArticlesByID } = require("./articles.models");
const { selectUserByName } = require("./users.models");

exports.selectCommentsByArticleID = (article_id) => {
  const articlePromise = selectArticlesByID(article_id);
  return articlePromise
    .then(() => {
      const selectQuery = `SELECT 
    c.comment_id, c.votes, c.created_at, u.name AS author, c.body 
    FROM comments c 
    JOIN articles a ON c.article_id=a.article_id 
    JOIN users u ON a.author=u.username 
    WHERE c.article_id=$1
    ORDER BY c.comment_id DESC`;
      return db.query(selectQuery, [article_id]).then(({ rows: comments }) =>
        comments.length > 0
          ? comments
          : Promise.reject({
              status: 404,
              msg: "Comments not present for the article",
            })
      );
    })
    .catch((err) => Promise.reject(err));
};

exports.insertCommentsByArticleID = ({ article_id, username, body }) => {
  if (
    article_id === undefined ||
    username === undefined ||
    body === undefined
  ) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }

  return selectArticlesByID(article_id)
    .then(() => selectUserByName(username))
    .then(() => {
      return db
        .query(
          `INSERT INTO comments 
    (body, author, article_id) 
    VALUES ($1, $2, $3) RETURNING * `,
          [body, username, article_id]
        )
        .then(({ rows: [comment] }) => comment);
    })
    .catch((err) => Promise.reject(err));
};
