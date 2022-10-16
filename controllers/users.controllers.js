const { selectUsers, selectUserByName } = require("../models/users.models");
const getUsers = (req, res, next) => {
  selectUsers()
    .then((users) => res.send({ users }))
    .catch((err) => next(err));
};

const getUserByName = (req, res, next) => {
  const { username } = req.params;
  selectUserByName(username)
    .then((user) => res.send({ user }))
    .catch(next);
};

module.exports = { getUsers, getUserByName };
