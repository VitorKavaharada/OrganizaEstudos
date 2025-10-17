const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

module.exports = function (req, res, next) {
    
  const token = req.cookies.token;
  if (!token) return res.redirect('/auth/login');

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.redirect('/auth/login');
  }
};