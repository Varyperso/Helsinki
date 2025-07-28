import { useDispatch } from 'react-redux'
import AnecdoteList from './components/AnecdoteList'
import AnecdoteForm from './components/AnecdoteForm'
import FilterAnecdotes from './components/FilterAnecdotes'
import Notification from './components/Notification'
import { useEffect, useState } from 'react'
import { initializeAnecdotes } from './reducers/anecdoteSlice'

const App = () => {
  const dispatch = useDispatch()
  
  useEffect(() => {
    dispatch(initializeAnecdotes())
  }, [])

  const [history, setHistory] = useState([]) // record history when elements gets added or swapped
  const [historyIndex, setHistoryIndex] = useState(0) // index of going back and forth in history

  return (
    <div>
      <div style={{ display: 'flex' }}>
        <FilterAnecdotes />
        <Notification />
      </div>
      <AnecdoteForm history={history} setHistoryIndex={setHistoryIndex} />
      <AnecdoteList history={history} setHistory={setHistory} historyIndex={historyIndex} setHistoryIndex={setHistoryIndex} />
    </div>
  )
}

export default App