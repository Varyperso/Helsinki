import { useDispatch, useSelector } from 'react-redux'
import { vote } from '../reducers/anecdoteReducer'
import { useEffect, useState, useRef } from 'react'

const AnecdoteList = () => {

  const anecdotes = useSelector(state => state)
  const dispatch = useDispatch()

  const [anecdotesSorted, setAnecdotesSorted] = useState(anecdotes) // redundant but i wanted to delay the sorting so it wont be immediate
  const [updatedIds, setUpdatedIds] = useState([]) // recently updated anecdotes temporary change color up until the sorting happens

  const sortingTimerId = useRef(null) // to clear the timers when user clicks vote

  const itemRefs = useRef({}) // chat gpt

  useEffect(() => {
    sortingTimerId.current = setTimeout(() => {
      setAnecdotesSorted([...anecdotes.sort((a, b) => b.votes - a.votes)]), // delay the sorting
      setTimeout(() => setUpdatedIds([]), 500) // delay emptying the updatedIds after sorting
    }, 1000)

    return () => clearTimeout(sortingTimerId.current)
  }, [anecdotes])

  return (
    <>
      <h2> Anecdotes </h2>
      {anecdotesSorted.map(anecdote => {
        const wasUpdatedId = updatedIds.find((id) => id === anecdote.id)
        const valueDifference = wasUpdatedId && anecdotes.reduce((x, y) => y.id === wasUpdatedId ? +y.votes : x, null) - anecdote.votes
        return (
          <div ref={el => itemRefs.current[anecdote.id] = el} key={anecdote.id} className={`anecdote ${wasUpdatedId && 'updated'}`}>
            <div>
              {anecdote.content}
            </div>
            <div>
              has {anecdote.votes}
              <button onClick={() => { dispatch(vote(anecdote.id)), setUpdatedIds(prev => [...prev, anecdote.id]) }} style={{color: wasUpdatedId ? "red" : "black"}} title="Click to vote for this anecdote"> vote </button>
              <span style={{ opacity: wasUpdatedId ? 1 : 0, transition: 'opacity 0.5s ease' }}>✓ Voted! {Boolean(valueDifference) && "+" + valueDifference} </span>
            </div>
          </div>
          ) 
        })
      } 
    </>
  )
}

export default AnecdoteList