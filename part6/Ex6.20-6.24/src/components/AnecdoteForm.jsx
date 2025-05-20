import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createAnecdote } from '../services/requests'
import Notification from './Notification'
import { useNotification } from '../contexts/notificationContext'

const AnecdoteForm = () => {
  const queryClient = useQueryClient()
  const [notification, setNotification] = useNotification()
  const anecdoteMutation = useMutation({ 
    mutationFn: createAnecdote, 
    onSuccess: (newAnecdote) => {
      const anecdotes = queryClient.getQueryData(['anecdotes'])
      queryClient.setQueryData(['anecdotes'], anecdotes.concat(newAnecdote))
      setNotification("new anecdote posted!", 4000)
    },
    onError: (error) => setNotification(error.message, 4000),
  })

  const addAnecdote = (e) => {
    e.preventDefault()
    const content = e.target.content.value
    e.target.content.value = ''
    anecdoteMutation.mutate({ content, votes: 0 })
  }

  return (
    <div>
      <h3>create new anecdote</h3>
      <form onSubmit={addAnecdote}>
        <input name='content' />
        <button type="submit">Add</button>
        {notification && <Notification text={notification} />}
      </form>
    </div>
  )
}

export default AnecdoteForm
