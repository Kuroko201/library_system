const jwt = require('jsonwebtoken');

function requireAuth(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.redirect('/login');       // no cookie → kick to login
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);  // valid?
    next();                              //  let them in
  } catch (err) {
    res.clearCookie('token');
    return res.redirect('/login');       // expired / tampered → kick out
  }
}

module.exports = requireAuth;