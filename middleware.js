const udb = require("./src/database/Usuario")
let jwt = require('jsonwebtoken');
const config = require('./config.js');

let checkToken = (req, res, next) => {
  let parts = req.get('Authorization').split(' ');
  udb.checkIfUserLoggedIn(parts[1] ,(resp)=>{
    
    if(+resp.logged==1)
    {
      next()
    }
    else{
      res.status(201).send({estado:"not loged in", logged:0})
    }
  /*
  console.log("TOKEN PRESENTE")
  let token = req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto converted to lowercase

  if(!token)
  {
    return res.json({
          success: false,
          message: 'Token is not valid'
        });
  }

  if (token.startsWith('Bearer ')) {
    // Remove Bearer from string
    token = token.slice(7, token.length);
  }

  if (token) {
    
    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
        return res.json({
          success: false,
          message: 'Token is not valid'
        });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    return res.json({
      success: false,
      message: 'Auth token is not supplied'
    });
  }
  */
});
}

module.exports = {
  checkToken
}