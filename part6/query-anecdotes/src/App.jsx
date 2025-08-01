import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAnecdotes, createAnecdote, updateAnecdote } from './services/anecdotes'
import AnecdoteForm from './components/AnecdoteForm'
import { useNotification } from '../src/context/NotificationContext'
import Notification from './components/Notification'

const App = () => {
  const queryClient = useQueryClient()
  const { dispatch } = useNotification()

  const {
    data: anecdotes,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
    retry: 1,
  })

  const showNotification = (message) => {
    dispatch({ type: 'SHOW_NOTIFICATION', payload: message })

    setTimeout(() => {
      dispatch({ type: 'CLEAR_NOTIFICATION' })
    }, 5000)
  }

  const createAnecdoteMutation = useMutation(createAnecdote, {
    onSuccess: () => {
      queryClient.invalidateQueries(['anecdotes'])
    },
  })

  const updateAnecdoteMutation = useMutation(updateAnecdote, {
    onSuccess: () => {
      queryClient.invalidateQueries(['anecdotes'])
    },
  })

const handleCreate = (content) => {
  createAnecdoteMutation.mutate(
    { content, votes: 0 },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['anecdotes'])
        showNotification(`Anécdota creada: "${content}"`)
      },
      onError: () => {
        showNotification('Error: la anécdota debe tener al menos 5 caracteres')
      },
    }
  )
}


  const handleVote = (anecdote) => {
    updateAnecdoteMutation.mutate(
      { ...anecdote, votes: anecdote.votes + 1 },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(['anecdotes'])
          showNotification(`Has votado la anécdota: "${anecdote.content}"`)
        },
      }
    )
  }

  if (isLoading) {
    return <div>Loading anecdotes...</div>
  }

  if (isError) {
    return <div>Anecdote service not available due to problems in server</div>
  }

  return (
    <div>
      <h2>Anecdotes</h2>
      <Notification />
      <AnecdoteForm onCreate={handleCreate} />
      <br />
      {anecdotes
        .toSorted((a, b) => b.votes - a.votes)
        .map((a) => (
          <div key={a.id} style={{ marginBottom: 10 }}>
            <div>{a.content}</div>
            <div>
              has {a.votes} <button onClick={() => handleVote(a)}>vote</button>
            </div>
          </div>
        ))}
    </div>
  )
}

export default App
