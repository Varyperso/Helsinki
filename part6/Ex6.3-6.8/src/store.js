import { configureStore } from '@reduxjs/toolkit'
import anecdoteReducer from './reducers/anecdoteSlice'
import anecdoteFilterReducer from './reducers/anecdoteFilterSlice'
import notificationReducer from './reducers/notificationSlice'

const store = configureStore({
  reducer: {
    anecdotes: anecdoteReducer,
    anecdotesFilter: anecdoteFilterReducer,
    notification: notificationReducer
  }
})

export default store