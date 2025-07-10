import { createSlice, createAsyncThunk, isPending, isFulfilled, isRejected } from "@reduxjs/toolkit"
import { setNotification } from "../notification/notificationSlice"
import loginService from '../../services/login'
import refreshTokenService from "../../services/refreshToken"
import { jwtDecode } from 'jwt-decode';

export const login = createAsyncThunk('user/login', async (credentials, { dispatch, rejectWithValue }) => {
  try {
    dispatch(setNotification('Logging in...'))
    const user = await loginService.login(credentials)
    localStorage.setItem('loggedInUser', JSON.stringify(user))
    dispatch(setNotification(`${user.username} logged in!`))
    return user
  }
  catch (error) {
    const message = error.response?.data?.error || error.message
    dispatch(setNotification(`Error logging in: ${message}`))
    return rejectWithValue(message)
  }
})

export const refreshToken = createAsyncThunk('user/refreshToken', async (_, { dispatch, getState, rejectWithValue }) => {
  const { token, username, name, id } = getState().user;
  if (!token) return rejectWithValue('No token to refresh');
  try {
    const newToken = await refreshTokenService.refreshToken(token);
    const updatedUser = { token: newToken, username, name, id };
    localStorage.setItem('loggedInUser', JSON.stringify(updatedUser));
    return updatedUser;
  } catch (err) {
    const message = err.response?.data?.error || err.message;
    return rejectWithValue(message);
  }
});

const storedUser = JSON.parse(localStorage.getItem('loggedInUser'));
let isTokenValid = false;
if (storedUser?.token) {
  try {
    const decoded = jwtDecode(storedUser.token);
    const now = Date.now() / 1000;
    isTokenValid = decoded.exp > now;
  } catch (err) {
    isTokenValid = false
  }
}
const initialUserState = isTokenValid
  ? { ...storedUser, status: 'succeeded', error: null }
  : { token: null, username: null, name: null, id: null, status: 'idle', error: null }

const userSlice = createSlice({
  name: 'user',
  initialState: {...initialUserState},
  reducers: {
    logout(state) {
      localStorage.removeItem('loggedInUser')
      return { token: null, username: null, name: null, id: null, status: 'idle', error: null }
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      isFulfilled(login, refreshToken),
      (state, action) => {
        const { token, username, name, id } = action.payload;
        state.token = token;
        state.username = username;
        state.name = name;
        state.id = id;
      }
    );
    
    builder.addMatcher(
      isPending(login),
      (state) => {
        state.status = 'loading'
        state.error = null
      }
    )

    builder.addMatcher(
      isFulfilled(login, refreshToken),
      (state) => {
        state.status = 'succeeded'
      }
    )

    builder.addMatcher(
      isRejected(login, refreshToken),
      (state, action) => {
        state.status = 'failed' // if we throw new Error("Error") before the try {} block == action.error.message
        state.error = action.payload || action.error.message // from rejectWithValue(someValue), someValue == action.payload always from catch block
      }
    )
  }
})

export const { logout } = userSlice.actions
export default userSlice.reducer