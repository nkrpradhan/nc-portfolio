const db = require("../db/connection");
const selectUsers = () => {
  return db.query("select * from users").then(({ rows: users }) => users);
};

const selectUserByName = (username) => {
  return db
    .query("select * from users where username=$1", [username])
    .then(({ rows: [user] }) =>
      user !== undefined
        ? user
        : Promise.reject({ status: 404, msg: "User Id not found" })
    );
};
module.exports = { selectUsers, selectUserByName };
