import { createContext, useReducer, useContext, useEffect, useRef } from "react"
const NotificationContext = createContext()

const notificationReducer = (state, { type, payload }) => {
  switch (type) {
    case 'SET_NOTIFICATION': return payload
    case 'CLEAR_NOTIFICATION': return null
    default: return state
  }
};

const NotificationContextProvider = ({ children }) => {
  const [notification, dispatch] = useReducer(notificationReducer, null)
  const notificationTimerRef = useRef(null)
  useEffect(() => () => clearTimeout(notificationTimerRef.current), []) // clear timer on unmount

  const setNotification = (message, duration) => {
    dispatch({ type: 'SET_NOTIFICATION', payload: message })
    clearTimeout(notificationTimerRef.current)
    notificationTimerRef.current = setTimeout(() => dispatch({ type: 'CLEAR_NOTIFICATION' }), duration)
  }
  return <NotificationContext.Provider value={ [notification, setNotification] }>{ children }</NotificationContext.Provider>
}

export default NotificationContextProvider

export const useNotification = () => useContext(NotificationContext)