const mongoose = require("mongoose");
require("dotenv").config();

function dbConnect() {
  if (process.env.NODE_ENV !== "production") {
    mongoose.set("debug", true);
  }
  mongoose.Promise = global.Promise;
  mongoose
    .connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("Successfully connected to mongodb!"))
    .catch((e) => console.error(e));
}

module.exports = { dbConnect };
