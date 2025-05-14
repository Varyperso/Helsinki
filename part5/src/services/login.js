const baseUrl = '/login'
import api from './api'

const login = async (credentials) => {
  const response =  await api.post(baseUrl, credentials)
  return response.data
}

const logout = (setUser) => {
  localStorage.removeItem('loggedUser')
  setUser(null)
}

export { login, logout }