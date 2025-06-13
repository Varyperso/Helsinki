import { Input } from '../../styled/Input'
import { useState } from 'react'
import { login } from './userSlice'
import { useDispatch } from 'react-redux'

const LoginForm = () => {
  const dispatch = useDispatch()
  const [credentials, setCredentials] = useState({ username: '', password: '' })

  const handleLogin = (e) => {
    e.preventDefault()
    dispatch(login(credentials)) // can await this if we have things that need execution right after loggin in, otherwise react state re-render will take care of it
    setCredentials({ username: '', password: '' })
  }

  const handleFormChange = ({ target }) => {
    setCredentials({ ...credentials, [target.name]: target.value })
  }

  return (
    <form onSubmit={handleLogin}>
      <div>
        <span>username</span> {' '}
        <Input type="text" value={credentials.username} name="username" onChange={handleFormChange} data-testid="username" />
      </div>
      <div>
        <span>password</span> {' '}
        <Input type="password" value={credentials.password} name="password" onChange={handleFormChange} data-testid="password" />
      </div>
      <button type="submit">login</button>
    </form>
  )
}

export default LoginForm