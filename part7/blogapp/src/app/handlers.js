import { deleteBlog } from "../features/blogs/blogsSlice"

export const handleDeleteBlog = (blogId, dispatch, navigate) => {
  if (window.confirm(`are you sure you want to delete blog ${blogId} ?`)) {
    dispatch(deleteBlog(blogId))
    navigate('/blogs')
  }
}