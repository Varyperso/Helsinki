const baseUrl = '/users'
import api from './api'

const fetchAll = async () => {
  const allUsers = await api.get(baseUrl)
  return allUsers.data
}

export default { fetchAll }