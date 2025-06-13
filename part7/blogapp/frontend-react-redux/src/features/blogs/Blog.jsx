import styled from 'styled-components'
import { useState } from 'react'
import { updateBlog } from './blogsSlice'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'

const BlogItem = styled.li`
  padding-top: 0.5em;
  padding-left: 2px;
  border: solid 1px;
  margin-bottom: 5px;
`

const TitleAuthor = styled.div`
  
`

const MoreInfo = styled.div`
  margin-top: 8px;
`

const Likes = styled.div`
  margin-top: 4px;
`

const Blog = ({ blog, onDeleteBlog }) => {
  const dispatch = useDispatch()
  const user = useSelector(state => state.user)

  const [toggleMoreInfo, setToggleMoreInfo] = useState(false)

  const handleToggleMoreInfo = () => setToggleMoreInfo(!toggleMoreInfo)

  const handleAddLike = (id, newObject) => {
    dispatch(updateBlog({ id, newObject }))
  }
  
  return (
    <BlogItem className="blog">
      <TitleAuthor data-testid="title and author">
        {blog.title} by {blog.author}
      </TitleAuthor>

      {toggleMoreInfo && (
        <MoreInfo>
          <div>{blog.url}</div>
          <Likes>
            Likes: {blog.likes}{' '}
            <button onClick={() => handleAddLike(blog.id, { ...blog, likes: blog.likes + 1, user: blog.user.id })}> + </button>
          </Likes>
          {user && user.id === blog.user.id && <button onClick={() => onDeleteBlog(blog.id)}>Delete</button>}
        </MoreInfo>
      )}

      <button onClick={handleToggleMoreInfo}>Show More</button>
    </BlogItem>
  )
}

export default Blog

Blog.propTypes = {
  blog: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    likes: PropTypes.number.isRequired,
    user: PropTypes.shape({
      id: PropTypes.string,
      username: PropTypes.string,
      name: PropTypes.string,
    }).isRequired,
  }).isRequired,
  onDeleteBlog: PropTypes.func.isRequired,
}