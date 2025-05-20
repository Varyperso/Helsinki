import { createSlice, current } from '@reduxjs/toolkit' // current() is to access the state inside the actions
import anecdoteService from '../services/anecdotes'
import { setNotification } from './notificationSlice'

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: { 
    createAnecdote(state, action) {
      const anecdote = action.payload
      return [...state, anecdote]
    },
    deleteAnecdote(state, action) {
      const anecdoteId = action.payload
      return state.filter(anecdote => anecdote.id != anecdoteId)
    },
    voteAnecdote(state, action) {
      const updated = action.payload
      return state.map(anecdote => anecdote.id !== updated.id ? anecdote : updated)
    },
    setAnecdotes(state, action) {
      return action.payload
    }
  },
})

export const { voteAnecdote, setAnecdotes, createAnecdote, deleteAnecdote } = anecdoteSlice.actions
export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}
export const addAnecdote = anecdote => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.createAnecdote(anecdote)
    dispatch(createAnecdote(newAnecdote))
    dispatch(setNotification(`added: ${newAnecdote.content}`, 3))
  }
}
export const removeAnecdote = anecdote => {
  return async dispatch => {
    await anecdoteService.deleteAnecdote(anecdote.id)
    dispatch(deleteAnecdote(anecdote.id))
    dispatch(setNotification(`removed: ${anecdote.content}`, 3))
  }
}
export const addVote = anecdote => {
  return async dispatch => {
    const updatedAnecdote = await anecdoteService.voteAnecdote(anecdote)
    dispatch(voteAnecdote(updatedAnecdote))
    dispatch(setNotification(`voted for ${anecdote.content}`, 3))
  }
}

export default anecdoteSlice.reducer