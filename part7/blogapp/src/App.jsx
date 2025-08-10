import { Routes, Route } from 'react-router';
import styled from 'styled-components';
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { fetchBlogs } from './features/blogs/blogsSlice'

import LoginForm from './features/user/LoginForm'
import BlogList from './features/blogs/BlogList'
import Blog from './features/blogs/Blog'
import User from './features/users/User'
import Users from './features/users/Users'
import Notification from './features/notification/Notification'
import useTokenAutoRefresh from './services/useTokenRefresh'
import useScreenResize from './services/useScreenResize'
import SlidingTabs from './components/SlidingTabs'
import Sidebar from './components/Sidebar'
import Navbar from './components/Navbar';

const AppContainer = styled.div`
  display: flex;
  position: relative;
`

const PageLayout = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.bgDark};
  color: ${({ theme }) => theme.colors.text};
  transition: 0.3s ease;
`;

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

const App = () => {
  const dispatch = useDispatch()
  const user = useSelector(state => state.user)

  useTokenAutoRefresh()
  useScreenResize()

  useEffect(() => {
    if (user.status === "succeeded") dispatch(fetchBlogs())
  }, [user.status])
  
  return (
    <PageLayout>
      <Navbar/>
      <AppContainer>
        <Sidebar/>

        <MainContainer>
          <Notification /> 

          {user.status !== "succeeded" && <LoginForm />}

          <Routes>
            <Route path="/" element={<div>hi</div>} />
            <Route path="/blogs" element={<BlogList />} />
            <Route path="/blogs/:id" element={<Blog />} />
            <Route path="/users" element={<Users />} />
            <Route path="/users/:id" element={<User />} />
          </Routes>

          <SlidingTabs/>
        
        </MainContainer>
      </AppContainer>
    </PageLayout>
  )
}

export default App