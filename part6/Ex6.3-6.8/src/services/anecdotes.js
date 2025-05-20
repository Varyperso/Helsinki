import axios from 'axios'

const baseUrl = 'http://localhost:3001/anecdotes'

const asObject = (anecdote) => {
  return {
    content: anecdote,
    votes: 0
  }
}

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const createAnecdote = async (anecdote) => {
  const anecdoteObject = asObject(anecdote)
  const response = await axios.post(baseUrl, anecdoteObject)
  return response.data
}

const deleteAnecdote = async (anecdoteId) => await axios.delete(`${baseUrl}/${anecdoteId}`)

export const voteAnecdote = async (anecdote) => {
  const updatedAnecdote = { ...anecdote, votes: anecdote.votes + 1 }
  const response = await axios.patch(`${baseUrl}/${anecdote.id}`, updatedAnecdote)
  return response.data
}

export default { getAll, createAnecdote, deleteAnecdote, voteAnecdote }