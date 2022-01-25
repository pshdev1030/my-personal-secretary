const mongoose = require("mongoose");
require("dotenv").config();

function dbConnect() {
  // 개발 모드일 경우 debut모드를 활성화
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
// MongoDB관련된건 모듈로 한 번에 연결하도록 함
module.exports = { dbConnect };
