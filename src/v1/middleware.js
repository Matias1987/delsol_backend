const auth = function(req, res, next) {
    
    if (req.session && req.session.user === "amy" && req.session.admin)
    {  
      console.log(JSON.stringify( req.session))
      return next();}
    else
      return res.sendStatus(401);
  };

export default auth