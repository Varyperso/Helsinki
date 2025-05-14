import { useState } from 'react'

const BlogForm = ({ onAddBlog }) => {
  const [blog, setBlog] = useState({ title: '', author: '', url: '' })

  const handleInputChange = ({ target }) => setBlog((prev) => ({ ...prev, [target.name]: target.value }))

  const handleAddBlog = async (e) => {
    e.preventDefault()
    await onAddBlog(blog)
    setBlog({ title: '', author: '', url: '' })
  }

  return (
    <form onSubmit={handleAddBlog}>
      <label htmlFor="title">
        Title
        <input type="text" id="title" name="title" value={blog.title} onChange={handleInputChange} data-testid="title" />
      </label>
      <label htmlFor="author">
        Author
        <input type="text" id="author" name="author" value={blog.author} onChange={handleInputChange} />
      </label>
      <label htmlFor="url">
        URL
        <input type="text" id="url" name="url" value={blog.url} onChange={handleInputChange} />
      </label>
      <button type="submit">save</button>
    </form>
  )
}

export default BlogForm