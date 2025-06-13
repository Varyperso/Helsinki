import { useDispatch, useSelector } from "react-redux"
import Blog from './Blog'
import { deleteBlog } from "./blogsSlice"

const BlogList = () => {
  const dispatch = useDispatch()
  const blogs = useSelector(state => state.blogs.items)

  const handleDeleteBlog = async (blogId) => {
    let isSure = window.confirm(`are you sure you want to delete blog ${blogId} ?`)
    isSure && dispatch(deleteBlog(blogId))
  }

  const sortedBlogs = blogs && [...blogs].sort((a, b) => b.likes - a.likes)

  console.log("blogs", sortedBlogs);
  
  return (
    <ul>
      {sortedBlogs.map(blog => <Blog key={blog.id} blog={blog} onDeleteBlog={handleDeleteBlog} />)}
    </ul>
  )
}

export default BlogList