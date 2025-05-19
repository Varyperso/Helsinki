import { useDispatch } from 'react-redux'
import { addAnecdote } from '../reducers/anecdoteSlice'

const AnecdoteForm = ({ history, historyIndex}) => {
  const dispatch = useDispatch()

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newAnecdote = e.target.newAnecdote.value
    dispatch(addAnecdote(newAnecdote))
  };
  
  return (
    <>
     <h2>create new</h2>
      <form onSubmit={handleSubmit}>
        <input name="newAnecdote" />
        <button disabled={historyIndex !== history.length - 1}>create</button>
      </form>
    </>
  )
}

export default AnecdoteForm