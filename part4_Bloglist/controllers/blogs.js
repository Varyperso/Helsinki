const blogsRouter = require('express').Router()
const { Blog, User } = require('../db')
const jwt = require('jsonwebtoken')

// Note.findById(noteId).populate('user', '-notes') // remove the notes field from the user object
// User.findById(userId).populate('notes', '-user') // remove the user field from the notes object

blogsRouter.get('/', async (req, res, next) => {
  try {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 }) // populate the user field with username and name only
    res.json(blogs)
  }
  catch (err) {
    next(err)
  }
})

blogsRouter.post('/', async (req, res, next) => {
  const { title, author, url } = req.body
  if (!req.token) return res.status(401).json({ error: 'invalid token' })
  if (!req.user) return res.status(404).json({ error: 'user not found' })
  const blog = new Blog({ title, author, url, user: req.user._id })
 
  try {
    const result = await blog.save()
    req.user.blogs = req.user.blogs.concat(result._id)
    await req.user.save()

    res.status(201).json(result)
  } catch (err) {
    next(err)
  }
})

blogsRouter.delete('/:id', async (req, res, next) => {
  const { id } = req.params
  if (!req.user) return res.status(404).json({ error: 'user not found' })
  if (!req.token) return res.status(401).json({ error: 'invalid token' })

  try {
    const deletedBlog = await Blog.findById(id)
    if (!deletedBlog) return res.status(404).json({ error: 'blog not found' })

    if (deletedBlog.user.toString() !== req.user._id.toString()) return res.status(401).json({ error: 'only the creator can delete this blog' })

    await Blog.findByIdAndDelete(id)
    res.status(204).end()
  }
  catch (err) {
    next(err)
  }
})


blogsRouter.patch('/:id', async (req, res, next) => {
  const { id } = req.params
  if (!req.user) return res.status(404).json({ error: 'user not found' })
  if (!req.token) return res.status(401).json({ error: 'invalid token' })
  try {

    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      { $set: req.body }, // Use $set to update only the fields provided in the request body
      { new: true, runValidators: true } // Options to return the updated document and run validators
    );
    if (!updatedBlog) return res.status(404).json({ error: 'blog not found' })

    res.status(200).json(updatedBlog);
  } catch (err) {
    next(err)
  }
});
  
module.exports = blogsRouter