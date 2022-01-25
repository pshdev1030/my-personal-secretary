require("dotenv").config();
const router = require("express").Router();
const User = require("../models/user");
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");

// 회원가입

router.post("/", async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const isEmailValid = User.validEmailValidator(email);
    const isEmailExist = await User.existEmailValidator(email);

    if (!isEmailValid) {
      return res
        .status(400)
        .json("회원가입에 실패하였습니다. 이메일의 형식이 아닙니다.");
    }

    if (isEmailExist) {
      return res
        .status(409)
        .json("회원가입에 실패하였습니다. 이미 사용중인 이메일입니다.");
    }

    const hashedPassword = await argon2.hash(password);
    const user = await User.create({
      email,
      username,
      password: hashedPassword,
    });
    const accessToken = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN);

    // 회원가입후 자동 로그인을 위해 같은 정보를 전송함

    return res.status(201).json({
      email: user.email,
      username: user.username,
      accessToken,
      appId: "aistudios.com",
      userKey: "6443234b-77d5-4013-bfd6-bb9399f317d9",
    });
  } catch (err) {
    return res.status(500).json(err);
  }
});

// 로그인

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const isEmailExist = await User.existEmailValidator(email);

    if (!isEmailExist) {
      return res
        .status(400)
        .json("로그인에 실패하였습니다. 존재하지 않는 이메일입니다.");
    }

    const user = await User.findOne().where("email").equals(email);
    const isPasswordCorrect = await argon2.verify(user.password, password);

    if (!isPasswordCorrect) {
      return res
        .status(400)
        .json("로그인에 실패하였습니다. 비밀번호가 일치하지 않습니다.");
    }

    // 토큰을 생성하여 전송

    const accessToken = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN);
    return res.status(201).json({
      email: user.email,
      username: user.username,
      accessToken,
      appId: "aistudios.com",
      userKey: "6443234b-77d5-4013-bfd6-bb9399f317d9",
    });
  } catch (err) {
    return res.status(500).json(err);
  }
});

module.exports = router;
