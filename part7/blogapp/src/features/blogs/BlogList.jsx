import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router"
import Button from "../../components/Buttons"
import { handleDeleteBlog } from "../../app/handlers"
import Togglable from "../../components/Togglable"
import BlogForm from "../blogs/BlogForm"
import styled from "styled-components"
import { useRef } from "react"

const FormWrapper = styled.div`
  margin-block: 1rem;
`

const BlogList = () => {
  const dispatch = useDispatch()
  const user = useSelector(state => state.user)
  const blogs = useSelector(state => state.blogs.items)

  const blogFormRef = useRef()

  const navigate = useNavigate()

  const handleAddBlog = async (blogObject) => {
    dispatch(addBlog(blogObject))
    blogFormRef.current.toggleVisibility()
  }

  if (user.status === 'idle' || user.status === 'failed') return <div>Please Login..</div>
  if (blogs.length === 0) return <div>No Blogs Yet..</div>

  return (
    <>
      {user.status === "succeeded" &&
        <FormWrapper>
          <Togglable buttonLabel="New Blog" ref={blogFormRef} >
            <BlogForm onAddBlog={handleAddBlog} />
          </Togglable>
        </FormWrapper>
      }
      {[...blogs].sort((a, b) => b.likes - a.likes).map(blog => (
        <div key={blog.id}>
          <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>{' '}
          {user.id === blog.user.id && <Button onClick={() => handleDeleteBlog(blog.id, dispatch, navigate)} variant='secondary'> Delete </Button>}
        </div>
      ))}
    </>
  )
}

export default BlogList