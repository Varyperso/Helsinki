import { createSlice, createAsyncThunk, isPending, isFulfilled, isRejected } from '@reduxjs/toolkit'
import { setNotification } from '../notification/notificationSlice'
import usersService from '../../services/users'

export const fetchAllUsers = createAsyncThunk(
  'users/getAll', 
  async (_, { dispatch, getState, rejectWithValue }) => {
    try {
      dispatch(setNotification('Fetching All Users...'))
      const users = await usersService.fetchAll()
      dispatch(setNotification(`All Users Fetched!`))
      return users
    }
    catch (error) {
      const message = error.response?.data?.error || error.message
      dispatch(setNotification(`Error Fetching Users: ${message}`))
      return rejectWithValue(message)
    }
  }
)

const initialUsersState = { data: [], status: 'idle', error: null }

const usersSlice = createSlice({
  name: 'users',
  initialState: {...initialUsersState},
  reducers: {
    removeBlogFromUser: (state, action) => {
      const blogId = action.payload.blogId;
      const userId = action.payload.userId;
      const user = state.data.find(u => u.id === userId);
      if (user) user.blogs = user.blogs.filter(b => b.id !== blogId);
    },
    addBlogToUser: (state, action) => {
      const createdBlog = action.payload;
      const user = state.data.find(u => u.id === createdBlog.user.id);
      if (user) user.blogs.push(createdBlog);
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAllUsers.fulfilled, (state, action) => {
      state.data = action.payload
    })

    builder.addMatcher(
      isPending(fetchAllUsers),
      (state) => {
        state.status = 'loading'
        state.error = null
      }
    )
    
    builder.addMatcher(
      isFulfilled(fetchAllUsers),
      (state) => {
        state.status = 'succeeded'
      }
    )

    builder.addMatcher(
      isRejected(fetchAllUsers),
      (state, action) => {
        state.status = 'failed'
        state.error = action.payload || action.error.message
      }
    )
  }
})

export const { addBlogToUser, removeBlogFromUser } = usersSlice.actions
export default usersSlice.reducer