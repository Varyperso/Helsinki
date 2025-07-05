import { useEffect } from 'react'
import { useMutation } from '@apollo/client'
import { LOGIN } from '../queries'

const LoginForm = ({ setToken, setUser, setPage, setError }) => {

  const [login, { data, error }] = useMutation(LOGIN, {
    onError: (error) => {
      setError(error.graphQLErrors[0].message)
      setTimeout(() => setError(''), 4000)
    }
  })

  useEffect(() => {
    if (data) {
      const token = data.login.value
      setToken(token)
      localStorage.setItem('userToken', token)
      setPage('books')
    }
  }, [data])

  const handleSubmit = async (event) => {
    event.preventDefault()
    const username = event.target.username.value
    const password = event.target.password.value
    login({ variables: { username, password } })
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          username <input name='username' />
        </div>
        <div>
          password <input type='password' name='password' />
        </div>
        <button type='submit'>login</button>
      </form>
    </div>
  )
}

export default LoginForm