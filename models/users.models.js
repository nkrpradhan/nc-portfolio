const db = require("../db/connection");
const selectUsers = () => {
   return  db.query('select * from users').then(({rows:users})=>users)
};
module.exports = { selectUsers };
