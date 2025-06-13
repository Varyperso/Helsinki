import { useState, useImperativeHandle } from 'react'
import PropTypes from 'prop-types'

const Togglable = ({ ref, children, buttonLabel }) => {
  const [visible, setVisible] = useState(false)

  const toggleVisibility = () => setVisible(!visible)

  useImperativeHandle(ref, () => ({ toggleVisibility }))

  return (
    <div>
      <div style={{ display: visible ? 'none' : '' }}>
        <button onClick={toggleVisibility}>{buttonLabel}</button>
      </div>
      <div style={{ display: visible ? '' : 'none' }} data-testid="togglable-content">
        {children}
        <button onClick={toggleVisibility}>cancel</button>
      </div>
    </div>
  )
}

Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired
}

export default Togglable