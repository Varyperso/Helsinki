require('dotenv').config();
const mongoose = require('mongoose');
const blogSchema = require('./models/blog');
const userSchema = require('./models/user');
const { MONGODB_URI } = require('./utils/config');

// Create **dedicated connection**, not global!

console.log('NODE_ENV:', process.env.NODE_ENV)

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Successfully connected to DB:', mongoose.connection.name) // Check which DB is connected
  })
  .catch(err => {
    console.error('Error connecting to DB:', err)
  });

// Attach model to this connection
const Blog = mongoose.model('Blog', blogSchema);
const User = mongoose.model('User', userSchema)

module.exports = { Blog, User };