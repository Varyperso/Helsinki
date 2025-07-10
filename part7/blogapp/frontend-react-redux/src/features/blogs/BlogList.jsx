import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router"
import Button from "../../components/Buttons"
import { handleDeleteBlog } from "../../app/handlers"

const BlogList = () => {
  const dispatch = useDispatch()
  const user = useSelector(state => state.user)
  const blogs = useSelector(state => state.blogs.items)

  const navigate = useNavigate()

  if (user.status === 'idle' || user.status === 'failed') return <div>Please Login..</div>
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