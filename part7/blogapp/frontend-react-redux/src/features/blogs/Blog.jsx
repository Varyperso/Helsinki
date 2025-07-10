import styled from 'styled-components'
import { updateBlog, addComment } from './blogsSlice'
import { useDispatch, useSelector } from 'react-redux'
import Button from '../../components/Buttons'
import { useParams, useNavigate, Link } from 'react-router'
import { handleDeleteBlog } from '../../app/handlers'
import BlogComments from './BlogComments'
import { Input } from '../../styled/Input'
import { useState } from 'react'

const BlogItem = styled.div`
  padding: 0.5em;
  border: ${({ theme }) => `0.125em solid ${theme.colors.bgLight}`};
  border-radius: 0.5em;
  margin-bottom: 0.5rem;
`

const TitleAuthor = styled.p`
  
`

const MoreInfo = styled.div`
  margin-top: 0.5rem;
`

const LikesAndDeleteWrapper = styled.div`
  margin-top: 0.25rem;
`

const Blog = () => {
  const [newComment, setNewComment] = useState('')

  const dispatch = useDispatch()
  const user = useSelector(state => state.user)
  const blogs = useSelector(state => state.blogs.items)

  const blogId = useParams().id
  const blog = blogs.find(b => b.id === blogId)

  const navigate = useNavigate()
  
  if (!blog) return <div>Invalid Blog Id..</div>

  const handleChange = ({ target }) => {
    setNewComment(target.value) 
  }
  const handleAddLike = () => {
    dispatch(updateBlog({ id: blog.id, newObject: { ...blog, likes: blog.likes + 1, user: blog.user.id } }))
  } 
  const handleAddComment = () => {
    dispatch(addComment({ id: blog.id, newComment: { content: newComment } }))
    setNewComment('')
  }
  
  return (
    <BlogItem className="blog">
      <TitleAuthor data-testid="title and author">
        {blog.title} By {blog.author}
      </TitleAuthor>

      <p>Added by <Link to={`/users/${blog.user.id}`}> {user.username} </Link></p>
      
      <MoreInfo>
        <a href={blog.url} target="_blank" rel="noopener noreferrer"> {blog.url} </a>

        <LikesAndDeleteWrapper>
          <span>Likes: {blog.likes}</span>{' '}
          {user.id && <Button onClick={handleAddLike} variant='secondary'> + </Button>} {' '}
          {user.id === blog.user.id && <Button onClick={() => handleDeleteBlog(blog.id, dispatch, navigate)}> Delete Blog </Button>}
        </LikesAndDeleteWrapper>
      </MoreInfo>

      <Input onChange={handleChange} value={newComment} placeholder='Add New Comment'/> {' '}
      <Button variant='secondary' onClick={handleAddComment}>Add Comment</Button>
      <BlogComments comments={blog.comments}/>
    </BlogItem>
  )
}

export default Blog