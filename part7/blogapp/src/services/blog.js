const baseUrl = '/blogs'
import api from './api'

const getAll = async () => {
  const response = await api.get(baseUrl)
  return response.data
}

const create = async (newObject) => {
  const response = await api.post(baseUrl, newObject)
  return response.data
}

const update = async (id, newObject) => {
  const response = await api.patch(`${baseUrl}/${id}`, newObject)
  return response.data
}

const deleteBlog = async (id) => {
  const response = await api.delete(`${baseUrl}/${id}`)
  return response.data
}

const addComment = async (id, newComment) => {
  const response = await api.post(`${baseUrl}/${id}/comments`, newComment);
  return response.data;
};

export default { getAll, create, update, deleteBlog, addComment }