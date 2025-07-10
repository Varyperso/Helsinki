const blogsRouter = require('express').Router()
const { Blog } = require('../db')
const middleware = require("../utils/middleware")

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

blogsRouter.post('/', middleware.userExtractor, async (req, res, next) => {
  const { title, author, url } = req.body
  const blog = new Blog({ title, author, url, user: req.user._id }) // doesn't throw, so not inside try-catch
  try {
    const savedBlog = await blog.save()
    req.user.blogs = req.user.blogs.concat(savedBlog._id)
    await req.user.save()
    const populatedBlog = await savedBlog.populate('user', { username: 1, name: 1 })
    res.status(201).json(populatedBlog)
  } catch (err) {
    next(err)
  }
})

blogsRouter.delete('/:id', middleware.userExtractor, async (req, res, next) => {
  const { id } = req.params
  try {
    const deletedBlog = await Blog.findById(id)
    if (!deletedBlog) return res.status(404).json({ error: 'blog not found' })
    if (deletedBlog.user.toString() !== req.user._id.toString()) return res.status(401).json({ error: 'Only the creator can delete this blog' })
    await Blog.findByIdAndDelete(id)
    req.user.blogs = req.user.blogs.filter(blog => blog.toString() !== id)
    await req.user.save()
    res.status(200).json({ blogId: id, userId: req.user.id })
  }
  catch (err) {
    next(err)
  }
})

blogsRouter.patch('/:id', middleware.userExtractor, async (req, res, next) => {
  const { id } = req.params
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      { $set: req.body }, // Use $set to update only the fields provided in the request body
      { new: true, runValidators: true } // Options to return the updated document and run validators
    ).populate('user');
    if (!updatedBlog) return res.status(404).json({ error: 'Blog Not Found' })
    res.status(200).json(updatedBlog)
  } catch (err) {
    next(err)
  }
});

blogsRouter.post('/:id/comments', middleware.userExtractor, async (req, res, next) => {
  const { content } = req.body
  try {
    const blog = await Blog.findById(req.params.id)
    if (!blog) return res.status(404).json({ error: 'Blog Not Found' })
    blog.comments.push({ content })
    const savedBlog = await blog.save()
    res.status(201).json(savedBlog)
  } catch (err) {
    next(err)
  }
})

blogsRouter.delete('/', middleware.userExtractor, middleware.adminOnly, async (req, res, next) => {
  try {
    await Blog.deleteMany({})
    res.status(204).end()
  }
  catch (err) {
    next(err)
  }
})
  
module.exports = blogsRouter