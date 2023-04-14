const auth = function(req, res, next) {
    if (req.session && req.session.user === "amy" && req.session.admin)
      return next();
    else
      return res.sendStatus(401);
  };

export default auth