import styled from 'styled-components';
import { useEffect, useRef } from 'react'
import { fetchBlogs, addBlog } from './features/blogs/blogsSlice'
import { loginSuccess, logout } from './features/users/userSlice'
import LoginForm from './features/users/LoginForm'
import BlogForm from './features/blogs/BlogForm'
import Togglable from './components/Togglable'
import Notification from './features/notification/Notification'
import BlogList from './features/blogs/BlogList'
import { useDispatch, useSelector } from 'react-redux'
import { setNotification } from './features/notification/notificationSlice';

const AppContainer = styled.div`
  padding: ${({ theme }) => theme.layout.basePadding};
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  min-height: 100vh;
  transition: background-color 0.3s ease, color 0.3s ease;
`;

const FormWrapper = styled.div`
  margin-block: 1rem;
`

const App = () => {
  const dispatch = useDispatch()
  const user = useSelector(state => state.user)
  const notification = useSelector(state => state.notification)

  const blogFormRef = useRef()

  console.log("user", user);

  useEffect(() => {
    if (user.status === 'idle') dispatch(fetchBlogs())
  }, [user.status])

  useEffect(() => {
    const loggedUserJSON = localStorage.getItem('loggedInUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch(loginSuccess(user))
    }
  }, [])

  console.log("user", user);
  
  useEffect(() => {
    if (notification && notification.toLowerCase().includes('expired')) {
      dispatch(setNotification('Session expired, logging out'))
      const timeout = setTimeout(() => {
        dispatch(logout())
      }, 4995)
      return () => clearTimeout(timeout)
    }
  }, [notification])

  console.log(notification);
  
  const handleAddBlog = async (blogObject) => {
    dispatch(addBlog(blogObject))
    blogFormRef.current.toggleVisibility()
  }

  return (
    <AppContainer>
      <h1>Blogs</h1>

      <Notification /> 

      {user.username ? 
        <FormWrapper>
          <div style={{ display: 'flex', gap: '0.25rem', marginBlock: '0.25rem'}}>
            <span>Hi {user.username}!</span>
            <button onClick={() => dispatch(logout())}> logout </button>
          </div>
          <Togglable buttonLabel="new blog" ref={blogFormRef} >
            <BlogForm onAddBlog={handleAddBlog} />
          </Togglable>
        </FormWrapper>
      :
        <LoginForm />
      }

      <BlogList />
    </AppContainer>
  )
}

export default App