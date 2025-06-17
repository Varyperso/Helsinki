import { Routes, Route, Navigate } from "react-router";
import styled from 'styled-components';
import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { addBlog } from './features/blogs/blogsSlice'
import { loginSuccess, logout } from './features/user/userSlice'

import BlogForm from './features/blogs/BlogForm'
import LoginForm from './features/user/LoginForm'

import Togglable from './components/Togglable'

import BlogList from './features/blogs/BlogList'
import Blog from "./features/blogs/Blog";
import User from "./features/users/User";
import Users from "./features/users/Users";
import Notification from './features/notification/Notification'

const AppContainer = styled.div`
  padding-inline: ${({ theme }) => theme.layout.wrapperPadding};
  margin-top: var(--space-m);
`;

const FormWrapper = styled.div`
  margin-block: 1rem;
`

const App = () => {
  const dispatch = useDispatch()
  const user = useSelector(state => state.user)

  const blogFormRef = useRef()

  useEffect(() => {
    const loggedUserJSON = localStorage.getItem('loggedInUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch(loginSuccess(user))
    }
    else dispatch(logout())
  }, [])
  
  const handleAddBlog = async (blogObject) => {
    dispatch(addBlog(blogObject))
    blogFormRef.current.toggleVisibility()
  }

  return (
    <AppContainer>
      
      <h1 style={{ textAlign: 'center' }}><u>Blogs</u></h1>

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
      
    </AppContainer>
  )
}

export default App