const { Blog, User } = require('../db')
const listWithOneBlog = [
  {
    _id: '5a422aa71b54a676234d1711',
    user: "681f408cecb155c6ffd2d191",
    title: 'new title',
    author: 'tom',
    url: 'https://example.com',
    __v: 0
  }
]
const listWithManyBlogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    user: "681f408cecb155c6ffd2d191",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    user: "681f408cecb155c6ffd2d191",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    user: "681f408cecb155c6ffd2d191",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0
  },
  {
    _id: "5a422b891b54a676234d17fa",
    user: "681f408cecb155c6ffd2d191",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    user: "681f408cecb155c6ffd2d191",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    user: "681f408cecb155c6ffd2d191",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0
  }  
]

const blogsForPost = listWithManyBlogs.map(({ _id, __v, user, likes, ...rest }) => rest)
const blogForPost = listWithOneBlog.map(({ _id, __v, user, likes, ...rest }) => rest)[0]

const extractRelevantFields = (blog) => {
  return {
    title: blog.title,
    author: blog.author,
    url: blog.url,
  }
}

const nonExistingId = async () => {
  const blog = new Blog({
    _id: "5a422a851b54a676234d17f7",
    user: "681f408cecb155c6ffd2d191",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0
  })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

module.exports = { listWithOneBlog, listWithManyBlogs, blogsForPost, blogForPost, blogsInDb, usersInDb, nonExistingId, extractRelevantFields }