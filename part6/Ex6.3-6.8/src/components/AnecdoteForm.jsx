import { useDispatch } from 'react-redux'
import { addAnecdote } from '../reducers/anecdoteSlice'
import { anecdoteFilter } from '../reducers/anecdoteFilterSlice'

const AnecdoteForm = ({ history, setHistoryIndex}) => {
  const dispatch = useDispatch()

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newAnecdote = e.target.newAnecdote.value
    dispatch(addAnecdote(newAnecdote))
    dispatch(anecdoteFilter(''))
    setHistoryIndex(history.length - 1)
  };
  
  return (
    <>
     <h2>create new</h2>
      <form onSubmit={handleSubmit}>
        <input name="newAnecdote" /> {" "}
        <button>create</button>
      </form>
    </>
  )
}

export default AnecdoteForm