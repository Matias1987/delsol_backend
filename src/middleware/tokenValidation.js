const usuarios_db = require("../database/Usuario");

async function tokenCheck(req, res, next) {
  //console.log("Authenticating incoming request...");
  console.log(`Authenticating incoming request... Incoming ${req.method} request to ${req.url}`);
  if (req.method === "POST") {
    if (
      req.url !== "/api/v1/usuarios/login/" &&
      req.url !== "/api/v1/usuarios/refresh_token/"
    ) {
      const token = req.headers.authorization?.split(" ")[1]; //req.headers.authorization;
      console.log("Authenticating request with token:", token);
      if (token) {
        const loged_id = await usuarios_db.checkIfUserLoggedInV2(token);
        console.log(loged_id); 
        if (loged_id) {
          console.log("Request authenticated");
          return next();
        } else {
          console.log("Request authentication failed");
          return res.status(401).json({ error: "Unauthorized" });
        }
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
