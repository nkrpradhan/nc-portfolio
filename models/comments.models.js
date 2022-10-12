const db = require("../db/connection");
const { selectArticlesByID } = require("./articles.models");
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
      return db
        .query(selectQuery, [article_id])
        .then(({ rows: comments }) =>
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
