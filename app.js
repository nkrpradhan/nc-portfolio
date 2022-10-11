const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topics.controllers");
const {
  getArticlesByID,
  updateArticlesByID,
} = require("./controllers/articles.controllers");
const { getUsers } = require("./controllers/users.controllers");
const {
  handleDBErrors,
  handleCustomErrors,
  handleInternalErrors,
} = require("./controllers/errors.controllers");

app.use(express.json());


app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticlesByID);

app.get("/api/users", getUsers);

app.patch("/api/articles/:article_id", updateArticlesByID);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Route Not Found" });
});

app.use(handleDBErrors);

app.use(handleCustomErrors);

app.use(handleInternalErrors);

module.exports = app;
