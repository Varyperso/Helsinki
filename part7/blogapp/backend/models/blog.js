const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const blogSchema = new mongoose.Schema({
    title: { type: String, required: [true, 'Blog title is required'] },
    author: String,
    url: { type: String, required: [true, 'Blog URL is required'] },
    likes: { type: Number, default: 0 },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  { strict: 'throw' } // throws an error and rejects unknown fields (instead of ignoring them without an error)
)

blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = blogSchema