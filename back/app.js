require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const { dbConnect } = require("./mongo");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const corsOpt = function (req, callbank) {
  callbank(null, { origin: true });
};

app.options("*", cors(corsOpt));

const port = process.env.PORT || 7000;

dbConnect();

app.get("/", (req, res) => {
  res.status(200).json({ id: "hi", username: "hi" });
});

const user = require("./router/user");
app.use("/user", user);

const schedule = require("./router/schedule");
app.use("/schedule", schedule);

app.listen(process.env.PORT, () =>
  console.log(`Successfully connected to Server on port ${process.env.PORT}!`)
);
