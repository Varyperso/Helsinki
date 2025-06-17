import { showNotification } from '../notification/notificationSlice'
import blogService from '../../services/blog'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { isPending, isRejected, isFulfilled } from '@reduxjs/toolkit'
import { addBlogToUser, removeBlogFromUser } from '../users/usersSlice'

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
      return rejectWithValue(error.message)
    }
  }
)

export const addBlog = createAsyncThunk(
  'blogs/create',
  async (newBlog, { dispatch, getState, rejectWithValue }) => {
    try {
      dispatch(showNotification('Adding blog...'))
      const created = await blogService.create(newBlog)      
      dispatch(showNotification('Blog created!'))
      dispatch(addBlogToUser(created))
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
      const updated = await blogService.update(id, newObject)
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
      const deleted = await blogService.deleteBlog(id)
      dispatch(showNotification(`Blog ${id} deleted!`))
      dispatch(removeBlogFromUser(deleted));
      return id
    } catch (error) {
      const message = error.response?.data?.error || error.message
      dispatch(showNotification(`Error deleting blog ${id}: ${message}`))
      return rejectWithValue(message)
    }
  }
)

export const addComment = createAsyncThunk(
  'blogs/addComment',
  async ({ id, newComment }, { dispatch, getState, rejectWithValue }) => {
    try {
      if (newComment.content === '') throw new Error('No Empty Comments')
      if (newComment.content.length < 2) throw new Error('Comment Too Short')
      dispatch(showNotification('Adding comment...'));
      const response = await blogService.addComment(id, newComment);
      dispatch(showNotification('Comment added!'));
      return response;
    } catch (error) {
      const message = error.response?.data?.error || error.message;
      dispatch(showNotification(`Error adding comment: ${message}`));
      return rejectWithValue(message);
    }
  }
);

const blogSlice = createSlice({
  name: 'blogs',
  initialState: {
    items: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(addBlog.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items.push(action.payload)
      })
      .addCase(updateBlog.fulfilled, (state, action) => {
        const updated = action.payload
        state.items = state.items.map(blog => blog.id === updated.id ? updated : blog)
      })
      .addCase(deleteBlog.fulfilled, (state, action) => {
        const deletedBlogId = action.payload
        state.items = state.items.filter(blog => blog.id !== deletedBlogId)
      })
      .addCase(addComment.fulfilled, (state, action) => {
        const updatedBlog = action.payload;
        const index = state.items.findIndex(blog => blog.id === updatedBlog.id);
        if (index !== -1) state.items[index] = updatedBlog;
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
        state.error = action.payload || action.error.message
      }
    )
  }
})

export default blogSlice.reducer