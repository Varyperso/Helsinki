import { createSlice } from '@reduxjs/toolkit'

let timerId;

const notificationSlice = createSlice({
  name: 'notification',
  initialState: "",
  reducers: {
    addNotification(state, action) {
      return action.payload;
    }
  }
})

export const { addNotification } = notificationSlice.actions
export const setNotification = (message, seconds) => { // redux "thunk"
  return dispatch => {
    clearTimeout(timerId)
    dispatch(addNotification(message))
    timerId = setTimeout(() => {
      dispatch(addNotification(''))
    }, seconds * 1000)
  }
}

export default notificationSlice.reducer
