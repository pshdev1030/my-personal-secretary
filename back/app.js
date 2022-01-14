require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const { dbConnect } = require("./mongo");
const cors = require("cors");

const app = express();

app.use(cors({ origin: "*", credentials: true }));
const port = process.env.PORT || 7000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

dbConnect();

const user = require("./router/user");
app.use("/user", user);

app.listen(process.env.PORT, () =>
  console.log(`Successfully connected to Server on port ${process.env.PORT}!`)
);
