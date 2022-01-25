require("dotenv").config();
const jwt = require("jsonwebtoken");

// jwt인증을 위한 미들웨어

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  // Bearer {{token}}

  if (token == null || undefined) return res.sendStatus(401);
  jwt.verify(token, process.env.ACCESS_TOKEN, (err, userId) => {
    if (err) return res.sendStatus(403);
    // 검증되지 않은 유저일경우 403을 보냄
    req.body.userId = userId.id;
    next();
  });
}

module.exports = authenticateToken;
