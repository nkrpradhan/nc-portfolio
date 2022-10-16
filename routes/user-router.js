const express = require("express");

//Router
const userRouter = express.Router();

//User controllers
const { getUsers, getUserByName } = require("../controllers/users.controllers");

userRouter.route("/").get(getUsers);
userRouter.route("/:username").get(getUserByName);

module.exports = userRouter;
