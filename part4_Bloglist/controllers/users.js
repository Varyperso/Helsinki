const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const { User } = require('../db')

usersRouter.get('/', async (req, res) => {
  const users = await User.find({}).populate('blogs' , { user: 0 }) // user: 0 to exclude the user field from the blogs
  res.json(users)
})

usersRouter.delete('/', async (req, res) => {
  await User.deleteMany({})
  res.status(204).end()
})

usersRouter.post('/', async (req, res) => {
  const { username, name, password } = req.body
  if (password.length < 3) return res.status(400).json({ error: 'password must be at least 3 characters long' })

  const passwordHash = await bcrypt.hash(password, 10)
  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()
  res.status(201).json(savedUser)
})

module.exports = usersRouter