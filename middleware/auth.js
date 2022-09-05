const jwt = require("jsonwebtoken");
const httpErrors = require("./error");

const authMiddlewareController = {
  verifyToken: (req, res, next) => {
    const token = req.headers.authorization;
    console.log(token);
    // const refreshToken = req.cookies.refreshToken;
    if (token) {
      const accessToken = token.split(" ")[1];
      jwt.verify(accessToken, process.env.JWT_SECRET_CODE, (err, user) => {
        if (err) {
          httpErrors.forbidden(res, err);
        } else {
          req.user = user;
          next();
        }
      });
    }
    if (!token) {
      console.log(token);
      httpErrors.notAuth(res);
    }
  },
};

module.exports = authMiddlewareController;
