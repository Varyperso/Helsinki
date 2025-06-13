const baseUrl = '/login'
import api from './api'

const login = async (credentials) => {
  const response = await api.post(baseUrl, credentials)
  return response.data
}

export default { login }