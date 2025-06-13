import { createSlice, createAsyncThunk, isPending, isFulfilled, isRejected } from "@reduxjs/toolkit"
import { showNotification } from "../notification/notificationSlice"
import loginService from '../../services/login'

export const login = createAsyncThunk('user/login', async (credentials, { dispatch, rejectWithValue }) => {
  try {
    dispatch(showNotification('Logging in...'))
    const user = await loginService.login(credentials)
    localStorage.setItem('loggedInUser', JSON.stringify(user))
    dispatch(showNotification(`${user.username} logged in!`))
    return user
  }
  catch (error) {
    const message = error.response?.data?.error || error.message
    dispatch(showNotification(`Error logging in: ${message}`))
    return rejectWithValue(message) // don't really need rejectWithValue, isRejected or state.error because i have the notificationSlice, but ok
  }
})

const initialUserState = { token: null, username: null, name: null, id: null, status: 'idle', error: null }

const userSlice = createSlice({
  name: 'user',
  initialState: {...initialUserState},
  reducers: {
    logout(state) {
      localStorage.removeItem('loggedInUser')
      return initialUserState
    },
    loginSuccess(state, action) { // login from the useEffect localStorage, no server communication here
      const { token, username, name, id } = action.payload
      state.token = token // can just mutate state because of Immer, no need to return the state
      state.username = username
      state.name = name
      state.id = id
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        const { token, username, name, id } = action.payload
        state.token = token
        state.username = username
        state.name = name
        state.id = id
      })
    
    builder.addMatcher(
      isPending(login),
      (state) => {
        state.status = 'loading'
        state.error = null
      }
    )

    builder.addMatcher(
      isFulfilled(login),
      (state) => {
        state.status = 'succeeded'
      }
    )

    builder.addMatcher(
      isRejected(login),
      (state, action) => {
        state.status = 'failed' // redundant, i have notificationSlice to display the error, but i kept it still
        state.error = action.payload || action.error.message
      }
    )

    // for cathing expired token errors in ALL asyncThunk slices in all reducers
    builder.addMatcher(
      (action) => isRejected(action) && typeof action.payload === 'string' && action.payload.toLowerCase().includes('expired'),
      (state, action) => {
        state.error = action.payload
        state.status = 'failed'
      }
)
  }
})

export const { logout, loginSuccess } = userSlice.actions
export default userSlice.reducer