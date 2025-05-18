import { useEffect, useState, useRef, useLayoutEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addVote } from '../reducers/anecdoteSlice'

const AnecdoteList = () => {

  const dispatch = useDispatch()
  const anecdotes = useSelector(state => state.anecdotes)
  const filter = useSelector(state => state.anecdotesFilter)
  const filteredAnecdotes = useMemo(() => {
    return anecdotes.filter(a => a.content.toLowerCase().includes(filter.toLowerCase()))
  }, [anecdotes, filter])

  const [anecdotesSorted, setAnecdotesSorted] = useState(filteredAnecdotes) // redundant but i wanted to delay the sorting so it wont be immediate
  const [updatedIds, setUpdatedIds] = useState([]) // recently updated anecdotes temporary change color up until the sorting happens(via the setTimeout)
  const [swapHistory, setSwapHistory] = useState({}) // swapped elements get their array indexes pushed to an array
  const sortingTimerId = useRef(null) // to clear the timers when user clicks vote(debounce sorting)
  const updatedIdsTimerId = useRef(null) // to remove the updatedIds after the sorting is over
  const itemRefs = useRef({}) // animate between the before and after sorting positions
  const oldPositions = useRef({}) // save the positions of the anecdotes right after pressing "vote"
  
  const handleVote = (anecdote) => {
    anecdotesSorted.forEach(a => { // count old positions before sorting for animation
      const domNode = itemRefs.current[a.id]
      if (domNode) {
        const rect = domNode.getBoundingClientRect()
        oldPositions.current[a.id] = rect.top
      }
    })
    dispatch(addVote(anecdote))
    setUpdatedIds(prev => [...prev, anecdote.id]) // add the voted upon anecdote id to the updatedIds list
  }

  useEffect(() => {
    if (Object.keys(swapHistory).length === 0) { // init an object of anecdote ids as keys with arrays of indexes as values
      anecdotesSorted.forEach((anecdote, idx) => {
        setSwapHistory(prev => {
          const prevCopy = {...prev}
          prevCopy[anecdote.id] = [idx + 1]
          return prevCopy
        })
      })
    }
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
    
    anecdotesSorted.forEach((a, idx) => {
      const el = itemRefs.current[a.id]
      if (!el) return

      const oldTop = oldPositions.current[a.id]
      const newTop = newPositions[a.id]
      let ogAnecdote = anecdotes.find(anecdote => anecdote.id === a.id)
      
      if (oldTop !== undefined && Math.abs(oldTop - newTop) > 1) {

        setSwapHistory(prev => { // add the new index to the obj with array of indexes
          const prevCopy = {...prev}
          if (!prevCopy[a.id]) prevCopy[a.id] = [idx + 1]
          else prevCopy[a.id].push(idx + 1)
          return prevCopy
        })

        const delta = oldTop - newTop

        el.style.transition = 'none' // Remove any inline transition override so it will snap into the old position
        el.style.transform = `translateY(${delta}px)` // Offset element to old position immediately

        void el.offsetHeight  // Force browser to apply the transform immediately

        el.style.transition = 'transform 0.3s cubic-bezier(.25,.75,.57,.96), background-color 0.8s cubic-bezier(.25,.75,.57,.96)'
        el.style.transform = 'translateY(0)'
        
        if (a.id == updatedIds[updatedIds.length - 1]) el.style.backgroundColor = 'rgb(12, 50, 3)'
        else el.style.backgroundColor = 'rgb(72, 5, 33)'
        setTimeout(() => el.style.backgroundColor = 'rgb(50, 3, 50)', 600)
      }
      else setTimeout(() => el.style.backgroundColor = 'rgb(34, 5, 34)', 1000) // back to og color
    })

    oldPositions.current = newPositions
  }, [anecdotesSorted])
  
  return (
    <>
      <h2>Anecdotes</h2>
      {anecdotesSorted.map((anecdote, idx) => {
        const wasUpdatedId = updatedIds.find((id) => id === anecdote.id) // was this anecdote recently voted on?
        const valueDifference = wasUpdatedId && anecdotes.reduce((x, y) => y.id === wasUpdatedId ? y.votes : x, null) - anecdote.votes
        const ogAnecdote = anecdotes.find(a => a.id === anecdote.id)
        return (
          <div ref={el => itemRefs.current[anecdote.id] = el} key={anecdote.id} className='anecdote'>
            <div>
              {anecdote.content}
            </div>
            <div>
              has {anecdote.votes} { " " }
              <button
                onClick={() => handleVote(ogAnecdote)} 
                style={{ backgroundColor: wasUpdatedId ? 'lightgreen' : 'lightblue', borderRadius: '1rem'}} 
                title="Click to vote for this anecdote"> vote </button>
              <span style={{ opacity: wasUpdatedId ? 1 : 0, transition: 'opacity 0.8s, color 0.8s', color:'rgb(255, 132, 95)' }}> ✓ Voted! {Boolean(valueDifference) && "+" + valueDifference} </span>
              {<div style={{ float: 'right' }}>{swapHistory[anecdote.id] ? swapHistory[anecdote.id].join(' => ') : idx + 1}</div>}
            </div>
          </div>
          )
        })
      } 
    </>
  )
}

export default AnecdoteList