const logger = require('./logger')
const jwt = require('jsonwebtoken')
const { User } = require('../db') 
const { SECRET } = require('./config')

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
  } else req.token = null
  next()
}

const userExtractor = async (req, res, next) => {
  req.user = null

  try {
    if (!req.token) {
      const err = new Error('Error - token invalid / no token')
      err.name = 'JsonWebTokenError'
      throw err
    }

    const decodedToken = jwt.verify(req.token, SECRET)
    const user = await User.findById(decodedToken.id)

    if (!user) {
      const err = new Error('Error - user not found')
      err.name = 'UserNotFound'
      throw err
    }

    req.user = user
    next()
  } catch (e) {
    next(e)
  }
}

const adminOnly = (req, res, next) => {
  try {
    if (!req.user || !req.user.isAdmin) {
      const err = new Error('Admin access required');
      err.name = 'Forbidden';
      res.status(403);
      throw err;
    }

    next();
  } catch (e) {
    next(e);
  }
};

const errorHandler = (error, req, res, next) => {
  logger.error(error)
  if (error.name === 'CastError') { // mongoose error - invalid id format given to findById()
      return res.status(400).send({ error: 'Error - malformatted id' })
  } else if (error.name === 'ValidationError') { // mongoose schema error - values posted weren't valid according to the schema
      return res.status(400).json({ error: `Error - ${error.message}` })
  } else if (error.name ===  'JsonWebTokenError') {
    return res.status(401).json({ error: error.message })
  } else if (error.name ===  'UserNotFound') {
    return res.status(401).json({ error: error.message })
  } else if (error.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'Error - token expired' })
  } else if (error.name === 'MongoServerError' && error.code === 11000) { // mongodb 11000 error code for duplicate key error
      const field = Object.keys(error.keyValue)[0]   // e.g., "name"
      const value = error.keyValue[field]            // e.g., "Alice"
      return res.status(409).json({
      error: `Error - The ${field} '${value}' already exists`
    })
  } else if (error.name === 'Forbidden') {
    res.status(403).json({ error: error.message }) // trying to access admin routes
  }
  else return res.status(500).json({ error: 'Error - Internal server error' })
  // next(error)
}

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'Error - unknown endpoint' })
}

module.exports = { requestLogger, unknownEndpoint, errorHandler, tokenExtractor,  userExtractor, adminOnly }