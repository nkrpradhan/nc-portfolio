const { selectUsers } = require("../models/users.models");
const getUsers = (req, res, next) => {
  selectUsers()
    .then((users) => res.send({ users }))
    .catch((err) => next(err));
};
module.exports = { getUsers };
