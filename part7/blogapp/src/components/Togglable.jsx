import { useState, useImperativeHandle } from 'react'
import Button from './Buttons'

const Togglable = ({ ref, children, buttonLabel }) => {
  const [visible, setVisible] = useState(false)

  const toggleVisibility = () => setVisible(!visible)

  useImperativeHandle(ref, () => ({ toggleVisibility }))

  return (
    <div>
      <div style={{ display: visible ? 'none' : '' }}>
        <Button onClick={toggleVisibility}>{buttonLabel}</Button>
      </div>
      <div style={{ display: visible ? '' : 'none' }} data-testid="togglable-content">
        {children} {' '}
        <Button onClick={toggleVisibility} variant='secondary'>Cancel</Button>
      </div>
    </div>
  )
}

export default Togglable