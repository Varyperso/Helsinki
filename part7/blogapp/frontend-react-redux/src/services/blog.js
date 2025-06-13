const baseUrl = '/blogs'
import api from './api'

const getAll = async () => {
  const response = await api.get(baseUrl)
  return response.data
}

const create = async (newObject, token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } }
  const response = await api.post(baseUrl, newObject, config)
  return response.data
}

const update = async (id, newObject, token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } }
  const response = await api.patch(`${baseUrl}/${id}`, newObject, config)
  return response.data
}

const deleteBlog = async (id, token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } }
  const response = await api.delete(`${baseUrl}/${id}`, config)
  return response.data
}

export default { getAll, create, update, deleteBlog }