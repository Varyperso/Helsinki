require('dotenv').config()
const fs = require('fs')
const path = require('path')
const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const morgan = require('morgan')
const middleware = require('./utils/middleware')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const blogsRouter = require('./controllers/blogs')

const app = express()

const corsOptions = {
  origin: 'http://localhost:5173',  // Allow only this origin
  methods: ['GET', 'POST', 'DELETE', 'PUT'], // You can specify allowed methods
  allowedHeaders: ['Content-Type'], // You can specify allowed headers if needed
}
app.use(cors(corsOptions))
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"], // if you use inline styles
      imgSrc: ["'self'", "data:"],
      connectSrc: ["'self'", "http://localhost:3001"], // backend API
      fontSrc: ["'self'"],
    }
  }
}));
app.use(express.json())
app.use(morgan('tiny')) // present for logger

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })
morgan.token('req-body-json', (req, res) => {
  return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms - :req-body-json', { stream: accessLogStream }))

app.use(middleware.tokenExtractor)
app.use(middleware.requestLogger)
app.use('/api/users', usersRouter) // can apply middleware here between the uri and the router , 
app.use('/api/login', loginRouter)
app.use('/api/blogs', blogsRouter) 
if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing')
  app.use('/api/testing', testingRouter)
}
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app