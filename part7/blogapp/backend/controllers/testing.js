const router = require('express').Router()
const { User, Blog } = require('../db')

router.post('/reset', async (request, response) => {
  await Blog.deleteMany({})
  await User.deleteMany({})
  
  response.status(204).end()
})

module.exports = router