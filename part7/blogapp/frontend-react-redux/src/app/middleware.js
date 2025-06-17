import { isRejected } from "@reduxjs/toolkit"
import { setNotification } from "../features/notification/notificationSlice"
import { logout } from "../features/user/userSlice"

export const sessionExpirationMiddleware = store => next => action => {
  if (
    isRejected(action) &&
    typeof action.payload === 'string' &&
    (action.payload.toLowerCase().includes('expired') || action.payload.includes('401'))
  ) {
    store.dispatch(setNotification('Session expired, logging out'))
    setTimeout(() => store.dispatch(logout()), 4000)
  }
  return next(action)
}