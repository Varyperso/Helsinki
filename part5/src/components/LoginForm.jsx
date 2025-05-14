import { useState } from 'react'
import PropTypes from 'prop-types'

const LoginForm = ({ onLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    await onLogin({ username, password })
    setUsername('')
    setPassword('')
  }

  return (
    <form onSubmit={handleLogin}>
      <div>
        <span>username</span>
        <input type="text" value={username} name="Username" onChange={({ target }) => setUsername(target.value)} data-testid="username" />
      </div>
      <div>
        <span>password</span>
        <input type="password" value={password} name="Password" onChange={({ target }) => setPassword(target.value)} data-testid="password" />
      </div>
      <button type="submit">login</button>
    </form>
  )
}

LoginForm.propTypes = {
  onLogin: PropTypes.func.isRequired
}

export default LoginForm