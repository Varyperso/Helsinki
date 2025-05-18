import { useEffect, useState, useRef, useLayoutEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addVote } from '../reducers/anecdoteSlice'
import { setNotificationWithTimeout } from '../reducers/notificationSlice'

const AnecdoteList = () => {

  const dispatch = useDispatch()
  const anecdotes = useSelector(state => state.anecdotes)
  const filter = useSelector(state => state.anecdotesFilter)
  const filteredAnecdotes = useMemo(() => {
    return anecdotes.filter(a => a.content.toLowerCase().includes(filter.toLowerCase()))
  }, [anecdotes, filter])

  const [anecdotesSorted, setAnecdotesSorted] = useState(filteredAnecdotes) // redundant but i wanted to delay the sorting so it wont be immediate
  const [updatedIds, setUpdatedIds] = useState([]) // recently updated anecdotes temporary change color up until the sorting happens(via the setTimeout)
  const sortingTimerId = useRef(null) // to clear the timers when user clicks vote(debounce sorting)
  const updatedIdsTimerId = useRef(null) // to remove the updatedIds after the sorting is over
  const itemRefs = useRef({}) // chat gpt to animate between the before and after sorting positions
  const oldPositions = useRef({}) // save the positions of the anecdotes right after pressing "vote"
  
  const handleVote = (anecdote) => {
    anecdotesSorted.forEach(a => {
      const domNode = itemRefs.current[anecdote.id]
      if (domNode) {
        const rect = domNode.getBoundingClientRect()
        oldPositions.current[anecdote.id] = rect.top
      }
    })
    dispatch(addVote(anecdote))
    setUpdatedIds(prev => [...prev, anecdote.id])
  }

  useEffect(() => {
    sortingTimerId.current = setTimeout(() => setAnecdotesSorted([...filteredAnecdotes].sort((a, b) => b.votes - a.votes)), 1000) // delay the sorting
    updatedIdsTimerId.current = setTimeout(() => setUpdatedIds([]), 2000) // delay emptying the updatedIds
    return () => { clearTimeout(sortingTimerId.current), clearTimeout(updatedIdsTimerId.current) } // debounce
  }, [filteredAnecdotes])
  
  useLayoutEffect(() => {
    const newPositions = {} // new positions after sorting(right after the setTimeout)
    anecdotesSorted.forEach(anecdote => {
      const domNode = itemRefs.current[anecdote.id]
      if (domNode) {
        const rect = domNode.getBoundingClientRect()    
        newPositions[anecdote.id] = rect.top
      }
    })
    
    anecdotesSorted.forEach(anecdote => {
      const el = itemRefs.current[anecdote.id]
      if (!el) return

      const oldTop = oldPositions.current[anecdote.id]
      const newTop = newPositions[anecdote.id]
      if (oldTop !== undefined && oldTop !== newTop) {
        const delta = oldTop - newTop

        // Remove any inline transition override
        el.style.transition = 'none'

        // Offset element to old position immediately
        el.style.transform = `translateY(${delta}px)`

        // Force browser to apply the transform immediately
        void el.offsetHeight

        // Remove the transform so it animates to new position with CSS transition
        el.style.transition = ''  // clear inline transition to fall back to CSS
        el.style.transform = 'translateY(0)'
      }
    })

    oldPositions.current = newPositions
  }, [anecdotesSorted])
  
  return (
    <>
      <h2>Anecdotes</h2>
      {anecdotesSorted.map(anecdote => {
        const wasUpdatedId = updatedIds.find((id) => id === anecdote.id) // was this anecdote recently voted on?
        const ogAnecdote = anecdotes.find(a => a.id === anecdote.id)
        return (
          <div ref={el => itemRefs.current[anecdote.id] = el} key={anecdote.id} className={`anecdote ${wasUpdatedId && 'updated'}`}>
            <div>
              {anecdote.content}
            </div>
            <div>
              has {anecdote.votes}
              <button
                onClick={() => handleVote(ogAnecdote)} 
                style={{backgroundColor: wasUpdatedId ? "lightgreen" : "lightgray"}} 
                title="Click to vote for this anecdote"> vote </button>
              <span style={{ opacity: wasUpdatedId ? 1 : 0, transition: 'opacity 0.5s ease' }}>✓ Voted! +1</span>
            </div>
          </div>
          )
        })
      } 
    </>
  )
}

export default AnecdoteList