const fs = require("fs/promises");

exports.getAllEndpoints = (req, res, next) => {
  fs.readFile(`${__dirname}/../endpoints.json`, "utf-8")
    .then((availableEndpoints) =>
      res.send({ availableEndpoints: JSON.parse(availableEndpoints) })
    )
    .catch(next);
};
