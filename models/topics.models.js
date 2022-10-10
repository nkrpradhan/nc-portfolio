const db = require("../db/connection");

const selectTopics = () => {
  return db.query("select * from topics").then(({ rows: topics }) => topics);
};

module.exports = { selectTopics };
