const express = require("express");

//Router
const apiRouter = express.Router();
const articleRouter = require("./article-router");
const topicRouter = require("./topic-router");
const userRouter = require("./user-router");
const commentRouter = require("./comment-router");

//Endpoint controllers
const { getAllEndpoints } = require("../controllers/endpoints.controllers");

apiRouter.get("/", getAllEndpoints);

apiRouter.use("/articles", articleRouter);

apiRouter.use("/topics", topicRouter);

apiRouter.use("/users", userRouter);

apiRouter.use("/comments", commentRouter);

module.exports = apiRouter;
