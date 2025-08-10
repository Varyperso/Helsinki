import { Input } from '../../styled/Input'
import { useState } from 'react'
import { login } from './userSlice'
import { useDispatch } from 'react-redux'
import Button from '../../components/Buttons'

const LoginForm = () => {
  const dispatch = useDispatch()
  const [credentials, setCredentials] = useState({ username: '', password: '' })
  const [isOnShowPassword, setIsOnShowPassword] = useState(false)

  const handleLogin = (e) => {
    e.preventDefault()
    dispatch(login(credentials)) // can await this if we have things that need execution right after loggin in, otherwise react state re-render will take care of it
    setCredentials({ username: '', password: '' })
  }

  const handleFormChange = ({ target }) => {
    setCredentials({ ...credentials, [target.name]: target.value })
  }

  return (
    <form onSubmit={handleLogin} style={{ display: 'flex', alignItems:'center', gap: '0.25em', flexWrap: 'wrap' }}>
      <div>
        <span> username </span>
        <Input type="text" value={credentials.username} name="username" onChange={handleFormChange} data-testid="username" />
      </div>

      <div>
        <span> password </span>
        <Input type={isOnShowPassword ? 'text' : 'password'} value={credentials.password} name="password" onChange={handleFormChange} data-testid="password" autoComplete='off' />
      </div>

      <Button type="button" onClick={() => setIsOnShowPassword(prev => !prev)} style={{ fontSize: '0.75rem' }}> {isOnShowPassword ? 'Hide' : 'Show'} </Button>
      <Button type="submit"> login </Button>
    </form>
  )
}

export default LoginForm