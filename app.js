const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topics.controllers");
const { getArticlesByID } = require("./controllers/articles.controllers");
app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticlesByID);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Route Not Found" });
});

//DB errors
app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad Request" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.status === 404) {
    res.status(404).send(err);
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  res.status(500).send({ err });
});

module.exports = app;
