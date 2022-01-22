require("dotenv").config();
const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, process.env.ACCESS_TOKEN, (err, userId) => {
    if (err) return res.sendStatus(403);
    req.body.userId = userId.id;
    next();
  });
}

module.exports = authenticateToken;
