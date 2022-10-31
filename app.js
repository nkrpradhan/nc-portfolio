const express = require("express");
const app = express();
const cors = require("cors");
//Routers
const apiRouter = require("./routes/api-router");

//Error controllers
const {
  handleDBErrors,
  handleCustomErrors,
  handleInternalErrors,
} = require("./controllers/errors.controllers");

app.use(express.json());
app.use(cors());

app.use("/api", apiRouter);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Route Not Found" });
});

app.use(handleDBErrors);

app.use(handleCustomErrors);

app.use(handleInternalErrors);

module.exports = app;
