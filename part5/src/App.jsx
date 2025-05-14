import './App.css'
import { useState, useEffect, useRef } from 'react'
import { logout, login } from './services/login'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Blog from './components/Blog'
import blogService from './services/blog'
import Togglable from './components/Togglable'
import Notification from './components/Notification'

const App = () => {
  const [blogs, setBlogs] = useState(null)
  const [message, setMessage] = useState(null)
  const [user, setUser] = useState(null)

  const blogFormRef = useRef()

  useEffect(() => {
    const getBlogs = async () => {
      const fetchedBlogs = await blogService.getAll()
      setBlogs(fetchedBlogs)
    }
    getBlogs()
  }, [])

  useEffect(() => {
    const loggedUserJSON = localStorage.getItem('loggedUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (credentials) => {
    try {
      const user = await login(credentials)
      localStorage.setItem('loggedUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setMessage('Login successful')
      setTimeout(() => setMessage(null), 3000)
    } catch (e) {
      setMessage("Error: " + e.response.data.error)
      setTimeout(() => setMessage(null), 3000)
    }
  }

  const handleAddBlog = async (blogObject) => {
    try {
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(returnedBlog))
      blogFormRef.current.toggleVisibility()
      setMessage('New blog added')
      setTimeout(() => setMessage(null), 3000)
    }
    catch (e) {
      setMessage("Error: " + e.response.data.error)
      setTimeout(() => setMessage(null), 3000)
    }
  }

  const handleAddLike = async (blogId, updatedFieldObject) => {
    try {
      const updatedBlog = await blogService.update(blogId, updatedFieldObject)
      setBlogs(prevBlogs => prevBlogs.map(blog => blog.id === blogId ? updatedBlog : blog))
    }
    catch (e) {
      setMessage("Error: " + e.response.data.error)
      setTimeout(() => setMessage(null), 3000)
    }
  }

  const handleDeleteBlog = async (blogId) => {
    window.confirm(`are you sure you want to delete blog ${blogId} ?`)
    try {
      const DeletedBlog = await blogService.deleteBlog(blogId)
      setBlogs(prevBlogs => prevBlogs.filter(blog => blog.id !== blogId))
      setMessage('Blog Deleted')
      setTimeout(() => setMessage(null), 3000)
    }
    catch (e) {
      setMessage("Error: " + e.response.data.error)
      setTimeout(() => setMessage(null), 3000)
    }
  }

  const sortedBlogs = blogs?.sort((a, b) => b.likes - a.likes)

  return (
    <div>
      <h1>Blogs</h1>

      <Notification> {message} </Notification>

      {user ? 
        <>
          <span>hi {user.name}</span>
          <button onClick={() => logout(setUser)}> logout </button>
          <Togglable buttonLabel="new blog" ref={blogFormRef} >
            <BlogForm onAddBlog={handleAddBlog} />
          </Togglable>
        </>
      :
        <LoginForm onLogin={handleLogin} />
      }

      <ul>
        {sortedBlogs && sortedBlogs.map(blog =>
          <Blog key={blog.id} blog={blog} user={user} onAddLike={handleAddLike} onDeleteBlog={handleDeleteBlog} />
        )}
      </ul>

    </div>
  )
}

export default App
