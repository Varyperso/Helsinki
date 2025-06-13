import { showNotification } from '../notification/notificationSlice'
import blogService from '../../services/blog'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { isPending, isRejected, isFulfilled } from '@reduxjs/toolkit'

export const fetchBlogs = createAsyncThunk(
  'blogs/fetchAll',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      dispatch(showNotification('Loading blogs...'))
      const blogs = await blogService.getAll()
      dispatch(showNotification('Blogs loaded!'))
      return blogs // this will be action.payload in the extraReducers .fulfilled
    } catch (error) {
      const message = error.response?.data?.error || error.message // axios errors via response.data.error, if server down it errors with error.message
      dispatch(showNotification(`Error loading blogs: ${message}`))
      return rejectWithValue(error.message) // don't really need rejectWithValue, isRejected or state.error because i have the notificationSlice, but ok
    }
  }
)

export const addBlog = createAsyncThunk(
  'blogs/create',
  async (newBlog, { dispatch, getState, rejectWithValue }) => {
    try {
      dispatch(showNotification('Adding blog...'))
      const created = await blogService.create(newBlog, getState().user.token)
      dispatch(showNotification('Blog created!'))
      return created
    } catch (error) {
      const message = error.response?.data?.error || error.message
      dispatch(showNotification(`Error creating blog: ${message}`))
      return rejectWithValue(error.message)
    }
  }
)

export const updateBlog = createAsyncThunk(
  'blogs/update',
  async ({ id, newObject }, { dispatch, getState, rejectWithValue }) => {
    try {
      dispatch(showNotification('Updating blog...'))
      const updated = await blogService.update(id, newObject, getState().user.token)
      dispatch(showNotification('Blog updated!'))
      return updated
    } catch (error) {
      const message = error.response?.data?.error || error.message
      dispatch(showNotification(`Error updating blog: ${message}`))
      return rejectWithValue(message)
    }
  }
)

export const deleteBlog = createAsyncThunk(
  'blogs/delete',
  async (id, { dispatch, getState, rejectWithValue }) => {
    try {
      dispatch(showNotification('Deleting blog...'))
      const deleted = await blogService.deleteBlog(id, getState().user.token) // the server returns the deleted blog? need to check the server code for this :D
      dispatch(showNotification(`Blog ${id} deleted!`))
      return id
    } catch (error) {
      const message = error.response?.data?.error || error.message
      dispatch(showNotification(`Error deleting blog ${id}: ${message}`))
      return rejectWithValue(message)
    }
  }
)

const blogSlice = createSlice({
  name: 'blogs',
  initialState: {
    items: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null, // redundant, i have notificationSlice to display the error, kept it still
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // get all blogs
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      // create blog
      .addCase(addBlog.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items.push(action.payload)
      })
      // update blog
      .addCase(updateBlog.fulfilled, (state, action) => {
        const updated = action.payload
        state.items = state.items.map(blog => blog.id === updated.id ? updated : blog)
      })
      // delete blog
      .addCase(deleteBlog.fulfilled, (state, action) => {
        const deletedBlogId = action.payload
        state.items = state.items.filter(blog => blog.id !== deletedBlogId)
      })

    builder.addMatcher(
      isPending(fetchBlogs, addBlog, updateBlog, deleteBlog),
      (state) => {
        state.status = 'loading'
        state.error = null
      }
    )

    builder.addMatcher(
      isFulfilled(fetchBlogs, addBlog, updateBlog, deleteBlog),
      (state) => {
        state.status = 'succeeded'
      }
    )

    builder.addMatcher(
      isRejected(fetchBlogs, addBlog, updateBlog, deleteBlog),
      (state, action) => {
        state.status = 'failed'
        state.error = action.payload || action.error.message // rejectWithValue = action.payload, if i error another way its action.error.message
      }
    )
  }
})

export default blogSlice.reducer