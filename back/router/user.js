const router = require("express").Router();
const User = require("../models/user");
const argon2 = require("argon2");

const errorResponse = {
  wrongEmail: { message: "이메일의 형식이 아닙니다." },
  existEmail: { message: "이미 사용중인 이메일입니다." },
  noEmail: { message: "존재하지 않는 이메일입니다." },
  wrongPassword: { message: "비밀번호가 일치하지 않습니다." },
};

router.post("/", async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const isEmailValid = User.validEmailValidator(email);
    const isEmailExist = await User.existEmailValidator(email);

    if (!isEmailValid) {
      return res.status(400).json(errorResponse["wrongEmail"]);
    }

    if (isEmailExist) {
      return res.status(409).json(errorResponse["existEmail"]);
    }

    const hashedPassword = await argon2.hash(password);
    const user = await User.create({
      email,
      username,
      password: hashedPassword,
    });

    return res.status(201).json({
      email: user.email,
      username: user.username,
      id: user._id,
    });
  } catch (err) {
    return res.status(500).json(err);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const isEmailExist = await User.existEmailValidator(email);

    if (!isEmailExist) {
      return res.status(400).json(errorResponse["noEmail"]);
    }

    const user = await User.findOne().where("email").equals(email);
    const isPasswordCorrect = await argon2.verify(user.password, password);

    if (!isPasswordCorrect) {
      return res.status(400).json(errorResponse["wrongPassword"]);
    }
    return res.status(201).json({
      email: user.email,
      username: user.username,
      id: user._id,
    });
  } catch (err) {
    return res.status(500).json(err);
  }
});

module.exports = router;
