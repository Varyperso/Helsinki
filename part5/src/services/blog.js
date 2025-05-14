const baseUrl = '/blogs'
import api from './api'

let token = null

const setToken = newToken => token = `Bearer ${newToken}`

const getAll = async () => {
  const response = await api.get(baseUrl)
  return response.data
}

const create = async newObject => {
  const config = { headers: { Authorization: token } }
  const response = await api.post(baseUrl, newObject, config)
  return response.data
}

const update = async (id, newObject) => {
  const config = { headers: { Authorization: token } }
  const response = await api.patch(`${ baseUrl }/${id}`, newObject, config)
  return response.data
}

const deleteBlog = async (id) => {
  const config = { headers: { Authorization: token } }
  const response = await api.delete(`${ baseUrl }/${id}`, config)
  return response.data
}

export default { getAll, create, update, deleteBlog, setToken }