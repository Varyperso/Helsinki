import { createSlice } from '@reduxjs/toolkit'

let timeoutId = null

const notificationSlice = createSlice({
  name: 'notification',
  initialState: null,
  reducers: {
    setNotification(state, action) {
      return action.payload
    },
    clearNotification() {
      return null
    }
  }
})

export const { setNotification, clearNotification } = notificationSlice.actions

export const showNotification = (message, duration = 5000) => dispatch => {
  dispatch(setNotification(message))
  if (timeoutId) clearTimeout(timeoutId)
  timeoutId = setTimeout(() => {
    dispatch(clearNotification())
  }, duration)
}

export default notificationSlice.reducer