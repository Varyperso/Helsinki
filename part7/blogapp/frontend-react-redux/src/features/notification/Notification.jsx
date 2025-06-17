import { useSelector } from "react-redux"
import styled, { css } from "styled-components"

const NotificationBox = styled.p`
  padding: 0.5em 1em;
  border-radius: 0.5em;
  margin-bottom: 0.5rem;
  min-height: 3em;
  width: 100%;
  max-width: 30rem;
  align-content: center;

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
  const notification = useSelector((state) => state.notification)
  const isError = notification ? notification.startsWith('Error') : null

  return (
    <NotificationBox data-testid="notification" $isError={isError}>
      {notification || '\u00A0'}
    </NotificationBox>
  )
}

export default Notification
