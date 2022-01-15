const router = require("express").Router();
const User = require("../models/user");
const argon2 = require("argon2");

router.post("/", async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const isEmailValid = User.validEmailValidator(email);
    const isEmailExist = await User.existEmailValidator(email);

    if (!isEmailValid) {
      return res
        .status(400)
        .json({ error: "This email is not valid", success: false });
    }

    if (isEmailExist) {
      return res
        .status(409)
        .json({ error: "This email is already used", success: false });
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
      success: true,
    });
  } catch (err) {
    return res.status(500).json(err);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne().where("email").equals(email);
    if (!user) {
      return res
        .status(500)
        .json({ error: "This user is not exist", success: false });
    }
    const isPasswordCorrect = await argon2.verify(user.password, password);
    const isEmailExist = await User.existEmailValidator(email);

    if (!isEmailExist) {
      return res
        .status(400)
        .json({ error: "This email is not exist", success: false });
    }

    if (!isPasswordCorrect) {
      return res
        .status(400)
        .json({ error: "This password is incorrect", success: false });
    }
    return res.status(201).json({
      email: user.email,
      username: user.username,
      id: user._id,
      success: true,
    });
  } catch (err) {
    return res.status(500).json(err);
  }
});

module.exports = router;
