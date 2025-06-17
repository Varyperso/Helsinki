import { configureStore } from '@reduxjs/toolkit'
import userReducer from '../features/user/userSlice'
import blogsReducer from '../features/blogs/blogsSlice'
import usersReducer from '../features/users/usersSlice'
import notificationReducer from '../features/notification/notificationSlice'

import { sessionExpirationMiddleware } from './middleware'

const store = configureStore({
  reducer: {
    user: userReducer,
    blogs: blogsReducer,
    users: usersReducer,
    notification: notificationReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(sessionExpirationMiddleware),
})

export default store