require('dotenv').config()
const jwt = require('jsonwebtoken')
const refreshTokenRouter = require('express').Router()
const middleware = require('../utils/middleware')

refreshTokenRouter.post('/', middleware.userExtractor, async (req, res) => {
  try {
    const refreshedToken = jwt.sign({ username: req.user.username, id: req.user.id }, process.env.SECRET, { expiresIn: 3600 });
    res.json({ token: refreshedToken });
  } catch (err) {
    console.error(err);
    res.status(401).json({ error: 'Token invalid or expired' });
  }
});

module.exports = refreshTokenRouter