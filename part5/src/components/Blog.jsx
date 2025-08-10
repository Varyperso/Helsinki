import { useState } from 'react'

const blogStyle = {
  paddingTop: 10,
  paddingLeft: 2,
  border: '1px solid #5c4747ff',
  marginBottom: 5,
}

const Blog = ({ blog, onAddLike, onDeleteBlog, user }) => {
  const [toggleMoreInfo, setToggleMoreInfo] = useState(false)

  const handleToggleMoreInfo = () => setToggleMoreInfo(!toggleMoreInfo)
  const handleAddLike = async () => await onAddLike(blog.id, { likes: blog.likes + 1 })
  const handleDeleteBlog = async () => await onDeleteBlog(blog.id)
  
  return (
    <li style={blogStyle} className="blog">

      <div data-testid="title and author">{blog.title} by {blog.author}</div>

      {toggleMoreInfo &&
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', gap: '8px'}}>
        <a href={blog.url.startsWith('http') ? blog.url : `https://${blog.url}`} target="_blank" rel="noopener noreferrer">{blog.url}</a>
        <div>Likes: {blog.likes} <button onClick={handleAddLike}>+</button></div>
        {user && user.id === blog.user.id && <button onClick={handleDeleteBlog}>Delete</button>}
      </div>}

      <button onClick={handleToggleMoreInfo} style={{ marginBottom: '4px' }}>Show More</button>
    </li>
  )
}

export default Blog