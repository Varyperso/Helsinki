import { useState } from 'react'

const blogStyle = {
  paddingTop: 10,
  paddingLeft: 2,
  border: 'solid',
  borderWidth: 1,
  marginBottom: 5
}

const Blog = ({ blog, onAddLike, onDeleteBlog, user }) => {
  const [toggleMoreInfo, setToggleMoreInfo] = useState(false)

  const handleToggleMoreInfo = () => setToggleMoreInfo(!toggleMoreInfo)
  const handleAddLike = async () => await onAddLike(blog.id, { likes: blog.likes + 1 })
  const handleDeleteBlog = async () => await onDeleteBlog(blog.id)

  return (
    <li style={blogStyle} className="blog">

      <div data-testid="title and author">
        {blog.title} by {blog.author}
      </div>

      {toggleMoreInfo &&
      <div>
        <div>{blog.url}</div>
        <div>Likes: {blog.likes} <button onClick={handleAddLike}>+</button></div>
        {user && user.id === blog.user && <button onClick={handleDeleteBlog}>Delete</button>}
      </div>}

      <button onClick={handleToggleMoreInfo}>Show More</button>
    </li>
  )
}

export default Blog