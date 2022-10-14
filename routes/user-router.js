const express = require("express");

//Router
const userRouter = express.Router();

//User controllers
const { getUsers } = require("../controllers/users.controllers");
userRouter.get("/", getUsers);

module.exports = userRouter;
