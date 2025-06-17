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
    return rejectWithValue(message)
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
    loginSuccess(state, action) { // login from the <App> useEffect localStorage, no server communication here
      const { token, username, name, id } = action.payload
      state.token = token // can just mutate state because of Immer, no need to return the state
      state.username = username
      state.name = name
      state.id = id
      state.status = 'succeeded'
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.fulfilled, (state, action) => {
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
        state.status = 'failed' // if we throw new Error("Error") before the try {} block == action.error.message
        state.error = action.payload || action.error.message // from rejectWithValue(someValue), someValue == action.payload always from catch block
      }
    )
  }
})

export const { logout, loginSuccess } = userSlice.actions
export default userSlice.reducer