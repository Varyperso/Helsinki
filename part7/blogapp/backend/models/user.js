const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
      type: String,
      required: true,
      unique: true,
      minLength: [3, 'Username must be at least 3 characters long'],
    },
    name: String,
    passwordHash: { type: String, required: true},
    isAdmin: { type: Boolean, required: true, default: false },
    blogs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blog'
      }
    ],
  },
  { strict: 'throw' } // throws an error and rejects unknown fields (instead of ignoring them without an error)
)

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.passwordHash
  }
})

module.exports = userSchema