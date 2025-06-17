import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router"
import Button from "../../components/Buttons"
import { handleDeleteBlog } from "../../app/handlers"
import { useEffect } from "react"
import { fetchBlogs } from "./blogsSlice"

const BlogList = () => {
  const dispatch = useDispatch()
  const user = useSelector(state => state.user)
  const blogs = useSelector(state => state.blogs.items)

  const navigate = useNavigate()

  useEffect(() => {
    if (user.status === "succeeded") dispatch(fetchBlogs())
  }, [user.status])

  if (user.status === 'idle') return <div>Please Login..</div>
  if (blogs.length === 0) return <div>No Blogs Yet..</div>

  return (
    [...blogs].sort((a, b) => b.likes - a.likes).map(blog => (
      <div key={blog.id}>
        <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>{' '}
        {user.id === blog.user.id && <Button onClick={() => handleDeleteBlog(blog.id, dispatch, navigate)} variant='secondary'> Delete </Button>}
      </div>
    ))
  )
}

export default BlogList