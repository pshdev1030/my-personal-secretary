const mongoose = require("mongoose");
const validator = require("validator");

//사용자 정보를 저장하는 모델
const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      maxlength: 60,
    },
    username: {
      type: String,
      require: true,
      maxlength: 20,
    },
    password: {
      type: String,
      require: true,
      maxlength: 150,
    },
  },
  { timestamps: true }
);

UserSchema.statics.validEmailValidator = function (value) {
  const result = validator.isEmail(value);
  return result;
};

// 존재하는 이메일인지 확인한다.
// 회원가입과 로그인에 재사용한다.

UserSchema.statics.existEmailValidator = async function (value) {
  const result = (await this.findOne({ email: value })) ? true : false;
  return result;
};

UserSchema.statics.findUser = async function (id) {
  const result = (await this.findOne({ _id: id })) ? true : false;
  return result;
};

module.exports = mongoose.models.User || mongoose.model("User", UserSchema);
