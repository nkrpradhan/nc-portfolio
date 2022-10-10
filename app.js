const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topics.controllers");

app.get("/api/topics", getTopics);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Route Not Found" });
});

app.use((err, req, res, next) => {
  res.status(500).send({ err });
});

module.exports = app;
