const usuarios_db = require("../database/Usuario");
const isValidToken = (token, callback) => {
  console.log("checking token");
  usuarios_db.checkIfUserLoggedIn(token, (res) => {
    callback(+res.logged === 1);
  });
};

async function tokenCheck(req, res, next) {
  console.log("Authenticating incoming request...");
  console.log(`Incoming ${req.method} request to ${req.url}`);
  if (req.method === "POST") {
    if (
      req.url !== "/api/v1/usuarios/login/" &&
      req.url !== "/api/v1/usuarios/refresh_token/"
    ) {
      const token = req.headers.authorization;
      console.log("Authenticating request with token:", token);
      if (token) {
        isValidToken(token, (isValid) => {
          if (isValid) {
            console.log("Request authenticated");
            return next();
          } else {
            console.log("Request authentication failed");
            return res.status(401).json({ error: "Unauthorized" });
          }
        });
      } else {
        console.log("No token provided");
        return res.status(401).json({ error: "Unauthorized" });
      }
    } else {
      next();
    }
  } else {
    next();
  }
}

module.exports = tokenCheck;