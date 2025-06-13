const { test, before, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const helper = require('./tests_helper')
const supertest = require('supertest')
const { Blog, User } = require('../db')
const app = require('../app')
const mongoose = require('mongoose')

const api = supertest(app)

let token

before(async () => {
  const response = await api.post('/api/login').send({ username: 'abc', password: 'hhytr6'})
  token = response.body.token
  
  await Blog.deleteMany({}) // delete all blogs
  const testUser = await User.findOne({ username: 'abc' })

  testUser.blogs = [] // delete all blogs in users blogs array
  await testUser.save()

  const newInsertedBlogs = await Blog.insertMany(helper.blogsForPost) // this Does .save() all the blogs in the db..
  testUser.blogs = testUser.blogs.concat(newInsertedBlogs.map(blog => blog._id))
  await testUser.save()
})

test('blogs are returned as json', async () => {
  const blogs = await api.get('/api/blogs').expect(200).expect('Content-Type', /application\/json/) // regex because if we use string it is also followed by "charset=utf8" and gets messy
  assert.strictEqual(blogs.body.length, helper.listWithManyBlogs.length)
})

test('blogs have the "id" field instead of "_id"', async () => {
  const blogs = await api.get('/api/blogs').expect(200).expect('Content-Type', /application\/json/)
  assert.strictEqual(blogs.body[0]._id, undefined)
  assert.notStrictEqual(blogs.body[0].id, undefined)
})

test('post a new blog and verify it posted', async () => {
  const blogsAtStart = await Blog.find({})
  await api.post('/api/blogs').set('Authorization', `Bearer ${token}`).send(helper.blogForPost).expect(201).expect('Content-Type', /application\/json/)

  const blogsAtEnd = await Blog.find({})
  assert.strictEqual(blogsAtEnd.length, blogsAtStart.length + 1)

  const addedBlog = blogsAtEnd.find(b => b.title === helper.blogForPost.title)
  assert.deepStrictEqual(helper.extractRelevantFields(addedBlog), helper.blogForPost)
  
  await api.delete(`/api/blogs/${addedBlog._id}`).set('Authorization', `Bearer ${token}`).expect(204)
})

test('post a new valid blog with a bad token', async () => {
  const blogsAtStart = await Blog.find({})
  const blogToPost = helper.extractRelevantFields(helper.blogForPost)
  await api.post('/api/blogs').set('Authorization', `Bearer ${token}INVALID TOKEN`).send(blogToPost).expect(401).expect('Content-Type', /application\/json/)

  const blogsAtEnd = await Blog.find({})
  assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)
})

test('the "likes" property should default to 0 if its missing in the request', async () => {
  await api.post('/api/blogs').set('Authorization', `Bearer ${token}`).send(helper.blogForPost).expect(201).expect('Content-Type', /application\/json/)

  const blogsAtEnd = await Blog.find({})
  const addedBlog = blogsAtEnd.find(b => b.title === helper.blogForPost.title)

  assert(addedBlog)
  assert.strictEqual(addedBlog.likes, 0)

  await api.delete(`/api/blogs/${addedBlog._id}`).set('Authorization', `Bearer ${token}`).expect(204)
})

test('if "title" or "url" is missing from the data, should return error code 400', async () => {
  const blogWithoutTitle = { author: 'Someone', url: 'http://example.com' }
  const blogWithoutURL = { title: 'A blog without URL', author: 'Someone' }

  await api.post('/api/blogs').set('Authorization', `Bearer ${token}`).send(blogWithoutTitle).expect(400).expect('Content-Type', /application\/json/)
  await api.post('/api/blogs').set('Authorization', `Bearer ${token}`).send(blogWithoutURL).expect(400).expect('Content-Type', /application\/json/)
})

test('delete a blog', async () => {
  const blogsAtStart = await helper.blogsInDb()

  await api.post('/api/blogs').set('Authorization', `Bearer ${token}`).send(helper.blogForPost).expect(201).expect('Content-Type', /application\/json/)

  const postedBlog = await Blog.findOne({ title: helper.blogForPost.title })
  await api.delete(`/api/blogs/${postedBlog._id}`).set('Authorization', `Bearer ${token}`).expect(204)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)

  const deletedBlog = await Blog.findById(helper.blogForPost.id)
  assert.strictEqual(deletedBlog, null) // deleted blog should not be found

  const remainingBlogTitles = blogsAtEnd.map(blog => blog.title)
  assert.strictEqual(remainingBlogTitles.includes(helper.blogForPost.title), false) // blog deleted from db
})

test('edit a blog', async () => {
  const postedBlog = await api.post('/api/blogs').set('Authorization', `Bearer ${token}`).send(helper.blogForPost).expect(201).expect('Content-Type', /application\/json/)
  const editedBlog = await api.patch(`/api/blogs/${postedBlog.body.id}`).set('Authorization', `Bearer ${token}`).send({ likes: 100 }).expect(200).expect('Content-Type', /application\/json/)
  const updatedBlog = await Blog.findById(editedBlog.body.id)
  assert.strictEqual(updatedBlog.likes, 100)
  assert.strictEqual(editedBlog.body.likes, 100);
})

after(async () => {
  await mongoose.connection.close()
})