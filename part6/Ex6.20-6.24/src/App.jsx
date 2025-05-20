import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { useNotification } from './contexts/notificationContext'
import { getAnecdotes, updateAnecdote } from './services/requests'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

const App = () => {
  const queryClient = useQueryClient()
  const { isPending, isError, data, error } = useQuery({ queryKey: ['anecdotes'], queryFn: getAnecdotes, retry: false })
  const [notification, setNotification] = useNotification()
  const updateAnecdoteMutation = useMutation({
    mutationFn: updateAnecdote,
    onSuccess: (updatedAnecdote) => {
      const anecdotes = queryClient.getQueryData(['anecdotes'])
      queryClient.setQueryData(['anecdotes'], anecdotes.map(anecdote => anecdote.id === updatedAnecdote.id ? updatedAnecdote : anecdote))
      setNotification(`anecdote '${updatedAnecdote.content}' voted`, 4000)
    },
  })

  if (isPending) return <span>Loading...</span>
  if (isError) return <span>Error: {error.message}</span>

  const handleVote = (anecdote) => updateAnecdoteMutation.mutate({...anecdote, votes: anecdote.votes + 1 })

  return (
    <div>
      <h3>Anecdote app</h3>
    
      <AnecdoteForm />
    
      {data?.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
