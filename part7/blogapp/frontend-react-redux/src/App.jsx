import { Routes, Route, Navigate } from 'react-router';
import styled from 'styled-components';
import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { addBlog, fetchBlogs } from './features/blogs/blogsSlice'

import BlogForm from './features/blogs/BlogForm'
import LoginForm from './features/user/LoginForm'

import Togglable from './components/Togglable'

import BlogList from './features/blogs/BlogList'
import Blog from './features/blogs/Blog'
import User from './features/users/User'
import Users from './features/users/Users'
import Notification from './features/notification/Notification'
import useTokenAutoRefresh from './services/useTokenRefresh'
import useScreenResize from './services/useScreenResize'
import SlidingTabs from './components/SlidingTabs'
import Sidebar from './components/Sidebar'
import { H1 } from './styled/Text';

const AppContainer = styled.div`
  display: flex;
  position: relative;
`

const MainContainer = styled.main`
  flex: 1;
  margin-left: ${({ theme }) => theme.layout.sidebarWidth};
  padding-inline: ${({ theme }) => theme.layout.wrapperPadding};
  margin-top: var(--space-m);
  transition: margin-left 0.3s ease;

  @media (max-width: 768px) {
    margin-left: 0;
  }
`;

const FormWrapper = styled.div`
  margin-block: 1rem;
`

const App = () => {
  const dispatch = useDispatch()
  const user = useSelector(state => state.user)

  const blogFormRef = useRef()

  useTokenAutoRefresh()
  useScreenResize()

  useEffect(() => {
    if (user.status === "succeeded") dispatch(fetchBlogs())
  }, [user.status])
  
  const handleAddBlog = async (blogObject) => {
    dispatch(addBlog(blogObject))
    blogFormRef.current.toggleVisibility()
  }

  console.info(user);
  
  return (
    <AppContainer>
      <Sidebar/>

      <MainContainer>
        <H1 mt={1} style={{ textAlign: 'center' }}><u>Blogs</u></H1>

        <Notification /> 

        {user.status === "succeeded" &&
          <FormWrapper>
            <Togglable buttonLabel="New Blog" ref={blogFormRef} >
              <BlogForm onAddBlog={handleAddBlog} />
            </Togglable>
          </FormWrapper>
        }

        {user.status !== "succeeded" && <LoginForm /> }
        
        <Routes>
          <Route path="/" element={<Navigate to="/blogs" />} />
          <Route path="/blogs" element={ <BlogList /> }/>
          <Route path="/blogs/:id" element={ <Blog /> }/>
          <Route path="/users" element={ <Users /> }/>
          <Route path="/users/:id" element={ <User /> }/>
        </Routes>

        <SlidingTabs/>
      
      </MainContainer>
    </AppContainer>
  )
}

export default App