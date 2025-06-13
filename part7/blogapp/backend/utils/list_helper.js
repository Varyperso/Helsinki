const dummy = (blogs) => 1

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null
  return blogs.reduce((prev, current) => (prev.likes > current.likes) ? prev : current)
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null
  const authorCount = blogs.reduce((acc, blog) => {
    acc[blog.author] = (acc[blog.author] || 0) + 1
    return acc
  }, {})

  const mostBlogsAuthor = Object.keys(authorCount).reduce((a, b) => authorCount[a] > authorCount[b] ? a : b)
  return { author: mostBlogsAuthor, blogs: authorCount[mostBlogsAuthor] }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null
  const authorsLikes = blogs.reduce((acc, curr) => {
    acc[curr.author] = (acc[curr.author] || 0) + curr.likes
    return acc
  }, {})
 
  const authorWithMostLikes = Object.entries(authorsLikes).reduce((acc, curr) => curr[1] > acc[1] ? curr : acc)
  return  { author: authorWithMostLikes[0], likes: authorWithMostLikes[1] }
}

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes }