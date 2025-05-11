const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const { User } = require('../db')

loginRouter.post('/', async (req, res, next) => {
  const { username, password } = req.body
  try {
    const user = await User.findOne({ username })
    const correct = user && await bcrypt.compare(password, user.passwordHash)
    if (!correct) return res.status(401).json({ error: 'invalid username or password' })

    const token = jwt.sign({ username: user.username, id: user._id }, process.env.SECRET, { expiresIn: 3600 })
    res.status(200).send({ token, username: user.username, name: user.name, id: user._id })
  } catch (e) {
    next(e)
  }
})

module.exports = loginRouter