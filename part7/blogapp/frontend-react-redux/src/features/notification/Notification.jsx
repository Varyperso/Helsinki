import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled, { css, keyframes } from 'styled-components'
import { clearNotification } from './notificationSlice'

const slideIn = keyframes`
  from { transform: translateX(-100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`;

const slideOut = keyframes`
  from { transform: translateX(0); opacity: 1; }
  to { transform: translateX(-100%); opacity: 0; }
`;

const NotificationBox = styled.p`
  padding: 0.5em 1em;
  border-radius: 0.5em;
  margin-bottom: 0.5rem;
  min-height: 3em;
  width: 100%;
  max-width: 30rem;
  align-content: center;

  ${({ $visible }) => $visible ? css`animation: ${slideIn} 0.2s forwards;` : css`animation: ${slideOut} 0.4s forwards;`}

  ${({ $isError }) => $isError !== null && 
    css`
      color: ${$isError ? '#b00020' : '#0b6623'};
      background-color: ${$isError ? '#ffd6d6' : '#d6ffd6'};
      border: 1px solid ${$isError ? '#b00020' : '#0b6623'};
      color: ${$isError ? '#b00020' : '#0b6623'};
    `
  }
`

const Notification = () => {
  const dispatch = useDispatch()
  const notification = useSelector((state) => state.notification)
  const isError = notification ? notification.startsWith('Error') : null
  
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (notification) {
      setVisible(true)
      const timeout = setTimeout(() => { setVisible(false) }, 3000) // duration

      const cleanupTimeout = setTimeout(() => { dispatch(clearNotification()) }, 3600) // duration + animation duration

      return () => {
        clearTimeout(timeout)
        clearTimeout(cleanupTimeout)
      }
    }
  }, [notification])

  return (
    <NotificationBox data-testid="notification" $visible={visible} $isError={isError}>
      {notification || '\u00A0'}
    </NotificationBox>
  )
}

export default Notification
