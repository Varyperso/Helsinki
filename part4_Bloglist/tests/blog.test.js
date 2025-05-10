const { test, before, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const helper = require('./tests_helper')
const supertest = require('supertest')
const { Blog } = require('../db')
const app = require('../app')
const mongoose = require('mongoose')

const api = supertest(app)

let token
before(async () => {
  const response = await api
    .post('/api/login') 
    .send({
      username: 'abc',
      password: 'hhytr6'
    })
  token = response.body.token
})

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.listWithManyBlogs)
})

test('blogs are returned as json', async () => {
  const blogs = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/) // regex because if we use string it is also followed by "charset=utf8" and gets messy

  assert.strictEqual(blogs.body.length, helper.listWithManyBlogs.length)
})

test('blogs have the "id" field instead of "_id"', async () => {
  const blogs = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(blogs.body[0]._id, undefined)
  assert.notStrictEqual(blogs.body[0].id, undefined)
})

test('post a new blog and verify it posted', async () => {
  const blogsAtStart = await Blog.find({})
  const blogToPost = helper.extractRelevantFields(helper.blogForPost)
  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(blogToPost)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await Blog.find({})
  assert.strictEqual(blogsAtEnd.length, blogsAtStart.length + 1)

  const addedBlog = blogsAtEnd.find(b => b.title === blogToPost.title)
  assert.deepStrictEqual(helper.extractRelevantFields(addedBlog), blogToPost)
})

test('post a new valid blog with a bad token', async () => {
  const blogsAtStart = await Blog.find({})
  const blogToPost = helper.extractRelevantFields(helper.blogForPost)
  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}INVALID TOKEN`)
    .send(blogToPost)
    .expect(401)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await Blog.find({})
  assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)
})

test('the "likes" property should default to 0 if its missing in the request', async () => {
  const blogWithoutLikes = {
    title: 'A blog without likes',
    author: 'Someone',
    url: 'http://example.com'
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(blogWithoutLikes)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await Blog.find({})
  const addedBlog = blogsAtEnd.find(b => b.title === blogWithoutLikes.title)

  assert(addedBlog)
  assert.strictEqual(addedBlog.likes, 0)
})

test('if "title" or "url" is missing from the data, should return error code 400', async () => {
  const blogWithoutTitle = {
    author: 'Someone',
    url: 'http://example.com'
  }
  const blogWithoutURL = {
    title: 'A blog without URL',
    author: 'Someone',
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(blogWithoutTitle)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(blogWithoutURL)
    .expect(400)
    .expect('Content-Type', /application\/json/)
})

test('delete a blog', async () => {
  const blogsAtStart = await helper.blogsInDb()

  const blogToPost = helper.extractRelevantFields(helper.blogForPost)
  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(blogToPost)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const postedBlog = await Blog.findOne({ title: blogToPost.title })
  await api
    .delete(`/api/blogs/${postedBlog.id}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(204)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)

  const deletedBlog = await Blog.findById(postedBlog.id)
  assert.strictEqual(deletedBlog, null) // The deleted blog should not be found

  // Optional: Verify that other blogs are unaffected
  const remainingBlogTitles = blogsAtEnd.map(blog => blog.title)
  assert.strictEqual(remainingBlogTitles.includes(blogToPost.title), false)
})

test('edit a blog', async () => {
  const blogToPost = helper.extractRelevantFields(helper.blogForPost)
  const postedBlog = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(blogToPost)
    .expect(201)
    .expect('Content-Type', /application\/json/)
  
  const editedBlog = await api
    .patch(`/api/blogs/${postedBlog.body.id}`)
    .set('Authorization', `Bearer ${token}`)
    .send({ likes: 100 })
    .expect(200)
    .expect('Content-Type', /application\/json/)
  
  const updatedBlog = await Blog.findById(editedBlog.body.id)
  assert.strictEqual(updatedBlog.likes, 100)
  assert.strictEqual(editedBlog.body.likes, 100);
})

after(async () => {
  await mongoose.connection.close()
})