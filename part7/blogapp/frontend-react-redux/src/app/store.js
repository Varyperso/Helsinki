import { configureStore } from '@reduxjs/toolkit'
import userReducer from '../features/users/userSlice'
import blogsReducer from '../features/blogs/blogsSlice'
import notificationReducer from '../features/notification/notificationSlice'

const store = configureStore({
  reducer: {
    user: userReducer,
    blogs: blogsReducer,
    notification: notificationReducer
  }
})

export default store