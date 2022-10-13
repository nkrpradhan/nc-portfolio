const fs = require("fs/promises");

exports.getAllEndpoints = (req, res, next) => {
  fs.readFile(`${__dirname}/../endpoints.json`, "utf-8")
    .then((data) => res.send(data))
    .catch(next);
};
