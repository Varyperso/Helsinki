import { useState } from "react"
import axios from "axios"
import "./Login.css" 


const baseUrl = 'http://localhost:3001'

const Login = () => {
  const [formOnLogin, setFormOnLogin] = useState(true)
  const [message, setMessage] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    const form = e.target
    const username = form.username.value
    const password = form.password.value
    const email = form.email ? form.email.value : null

    try {
      const endpoint = formOnLogin ? 'login' : 'register'
      const payload = formOnLogin
        ? { username, password }
        : { username, password, email }

      const response = await axios.post(`${baseUrl}/${endpoint}`, payload)
      setMessage(`Success: ${response.data.message || 'Logged in!'}`)
    } catch (err) {
      setMessage(`Error: ${err.response?.data?.error || err.message}`)
    }
  };

    return (
      <div className="login-container">
        <h2>{formOnLogin ? 'Login' : 'Register'}</h2>
        <form onSubmit={handleLogin} >
          <div className="inputs-wrapper">
            <input type="text" name="username" placeholder="Username" required className="input-field" />
            <input type="password" name="password" placeholder="Password" required className="input-field" />
            {!formOnLogin && (
              <input type="email" name="email" placeholder="Email" required className="input-field" />
            )}
          </div>
          <button type="submit" className="submit-btn">{formOnLogin ? 'Login' : 'Register'}</button>
        </form>
        <button onClick={() => setFormOnLogin(!formOnLogin)} className="toggle-btn">
          Switch to {formOnLogin ? 'Register' : 'Login'}
        </button>
        {message && <p className="message">{message}</p>}
      </div>
  )
}
export default Login