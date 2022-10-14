const express = require("express");

//Router
const topicRouter = express.Router();

//Topics controllers
const { getTopics } = require("../controllers/topics.controllers");
topicRouter.get("/", getTopics);

module.exports = topicRouter;
