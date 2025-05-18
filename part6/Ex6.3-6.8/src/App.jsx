import { useDispatch } from 'react-redux'
import anecdoteService from './services/anecdotes'
import AnecdoteList from './components/AnecdoteList'
import AnecdoteForm from './components/AnecdoteForm'
import FilterAnecdotes from './components/FilterAnecdotes'
import Notification from './components/Notification'
import { useEffect } from 'react'
import { initializeAnecdotes } from './reducers/anecdoteSlice'


const App = () => {

  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(initializeAnecdotes())
  }, [])

  return (
    <div>
      <div style={{ display: 'flex' }}>
        <FilterAnecdotes />
        <Notification />
      </div>
      <AnecdoteForm />
      <AnecdoteList />
    </div>
  )
}

export default App