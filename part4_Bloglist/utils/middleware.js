const logger = require('./logger')
const jwt = require('jsonwebtoken')
const { User } = require('../db') 

const requestLogger = (req, res, next) => {
  logger.info('Method:', req.method)
  logger.info('Path:  ', req.path)
  logger.info('Body:  ', req.body)
  logger.info('---')
  next()
}

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    req.token = authorization.substring(7) // remove 'Bearer ' from the token
  } else {
    req.token = null
  }

  next()
}

const userExtractor = async (req, res, next) => {
  if (req.token) {
    try {
      const decodedToken = jwt.verify(req.token, process.env.SECRET)
      const user = await User.findById(decodedToken.id)

      if (user) req.user = user
      else {
        req.user = null
        req.token = 'valid-but-user-not-found'  // mark special case if needed
      }
    } catch {
      req.user = null
      req.token = null  // invalid token → completely discard
    }
  }

  next()
}

const errorHandler = (error, req, res, next) => {
  logger.error(error)
  if (error.name === 'CastError') { // mongoose cast error (invalid id format given to findById())
      return res.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') { // mongoose schema validation error (values posted weren't valid according to the schema)
      return res.status(400).json({ error: error.message })
  } else if (error.name === 'MongoServerError' && error.code === 11000) { // mongodb 11000 error code for duplicate key error
      const field = Object.keys(error.keyValue)[0]   // e.g., "name"
      const value = error.keyValue[field]            // e.g., "Alice"
      return res.status(409).json({
      error: `The ${field} '${value}' already exists`
    })
  } else if (error.name ===  'JsonWebTokenError') {
    return res.status(401).json({ error: 'token invalid' })
  } else if (error.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'token expired' })
  }
  
  else return res.status(500).json({ error: 'Internal server error' })
  // next(error)
}

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor, 
  userExtractor,
}