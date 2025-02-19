import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { getAll, modifyById } from './services/anecdote'
import NotificationContext from './NotificationContext'
import { useContext } from 'react'

const App = () => {
  const [notification, setNotification] = useContext(NotificationContext)
  const queryClient =  useQueryClient()

  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAll,
    retry: 1,
    refetchOnWindowFocus: false
  })

  const upvoteAnecdoteMutation = useMutation({
    mutationFn: modifyById,
    onSuccess: (updatedAnecdote) => {
      const anecdotes = queryClient.getQueryData(['anecdotes'])
      queryClient.setQueryData(
        ['anecdotes'], 
        anecdotes.map(a => a.id !== updatedAnecdote.id ? a : updatedAnecdote).sort((a,b) => b.votes - a.votes)
      )
      setNotification(`You voted for: ${updatedAnecdote.content}`)
    }
  })

  const handleVote = (anecdote) => {
    upvoteAnecdoteMutation.mutate({ ...anecdote, votes: anecdote.votes + 1 })
  }

  if (result.isError) {
    return <div>anecdote service not available due to problems in the server</div>
  }

  const anecdotes = result.data ? result.data.sort((a,b) => b.votes - a.votes) : result.data

  if (anecdotes) {
    return (
      <div>
        <h3>Anecdote app</h3>
      
        <Notification />
        <AnecdoteForm />
      
        {anecdotes.map(anecdote =>
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
  
}

export default App
