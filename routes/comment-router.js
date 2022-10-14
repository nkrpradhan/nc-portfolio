const express = require("express");

const commentRouter = express.Router();

//Comments controllers
const { deleteCommentByID } = require("../controllers/comments.controllers");

commentRouter.delete("/:comment_id", deleteCommentByID);

module.exports = commentRouter;
