const express = require("express");
const app = express();

//Topics controllers
const { getTopics } = require("./controllers/topics.controllers");

//Articles controllers
const {
  getArticles,
  getArticlesByID,
  updateArticlesByID,
} = require("./controllers/articles.controllers");

//Comments controllers
const {
  getCommentsByArticleID,
  postCommentsByArticleID,
  deleteCommentByID,
} = require("./controllers/comments.controllers");

//User controllers
const { getUsers } = require("./controllers/users.controllers");

//Error controllers
const {
  handleDBErrors,
  handleCustomErrors,
  handleInternalErrors,
} = require("./controllers/errors.controllers");

//Endpoint controllers
const { getAllEndpoints } = require("./controllers/endpoints.controllers");

app.use(express.json());

app.get("/api", getAllEndpoints);

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticlesByID);
app.get("/api/articles/:article_id/comments", getCommentsByArticleID);
app.post("/api/articles/:article_id/comments", postCommentsByArticleID);
app.get("/api/users", getUsers);

app.patch("/api/articles/:article_id", updateArticlesByID);

app.delete("/api/comments/:comment_id", deleteCommentByID);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Route Not Found" });
});

app.use(handleDBErrors);

app.use(handleCustomErrors);

app.use(handleInternalErrors);

module.exports = app;
