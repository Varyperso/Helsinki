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
  const timeoutsRef = useRef({}); // to remove the updatedIds after the sorting is over(cam also remove all of them in useEffect by setting .current = [])
  const bgTimers = useRef({}); // background timers
  const itemRefs = useRef({}) // animate between the before and after sorting positions
  const oldPositions = useRef({}) // save the positions of the anecdotes right after pressing "vote"
  
  const handleVote = (anecdote) => {
    dispatch(addVote(anecdote))

    setUpdatedIds(prev => [...prev, anecdote.id]) // add the voted upon anecdote id to the updatedIds list
    clearTimeout(timeoutsRef.current[anecdote.id]); // clear if this is the 2'nd+ vote
    timeoutsRef.current[anecdote.id] = setTimeout(() => { // new timer for the last vote on the same element
      setUpdatedIds(prev => prev.filter(id => id !== anecdote.id));
      delete timeoutsRef.current[anecdote.id]; // Clean up
    }, 1800);
  }

  useEffect(() => {
    if (Object.keys(swapHistory).length === 0) { // on comopnent mount only
      const initialHistory = {} // history for storing changing indexes of swapped elements
      anecdotesSorted.forEach((anecdote, idx) => initialHistory[anecdote.id] = [idx + 1])
      setSwapHistory(initialHistory)
      oldPositions.current = calculatePositions(anecdotesSorted, itemRefs) // set starting positions
    }
    sortingTimerId.current = setTimeout(() => setAnecdotesSorted([...filteredAnecdotes].sort((a, b) => b.votes - a.votes)), 1500) // delay the sorting
    return () => clearTimeout(sortingTimerId.current)
  }, [filteredAnecdotes])
  
  useLayoutEffect(() => {
    const newPositions = calculatePositions(anecdotesSorted, itemRefs)
    
    anecdotesSorted.forEach((a, idx) => {
      const el = itemRefs.current[a.id]
      if (!el) return

      const oldTop = oldPositions.current[a.id]
      const newTop = newPositions[a.id]
      
      if (oldTop !== undefined && Math.abs(oldTop - newTop) > 1) {
        setSwapHistory(prev => { // add the new index to the obj with array of indexes
          const prevCopy = {...prev}
          if (!prevCopy[a.id]) prevCopy[a.id] = [idx + 1]
          else prevCopy[a.id].push(idx + 1)
          return prevCopy
        })

        const delta = oldTop - newTop

        el.style.transition = 'background-color 0.8s cubic-bezier(.25,.75,.57,.96)' // Remove any inline transition override so it will snap into the old position
        el.style.transform = `translateY(${delta}px)` // Offset element to old position immediately

        void el.offsetHeight  // Force browser to apply the transform immediately

        el.style.transition = 'transform 0.3s cubic-bezier(.25,.75,.57,.96), background-color 0.8s cubic-bezier(.25,.75,.57,.96)'
        el.style.transform = 'translateY(0)'
      
        if (a.id === updatedIds[updatedIds.length - 1]) setTempBackground(bgTimers, el, a.id, 'rgb(12, 50, 3)', 'rgb(50, 3, 50)', 600); // recent vote
        else setTempBackground(bgTimers, el, a.id, 'rgb(72, 5, 33)', 'rgb(50, 3, 50)', 600); // swapped
      }
      else setTempBackground(bgTimers, el, a.id, el.style.backgroundColor, 'rgb(34, 5, 34)', 1200); // back to og color cuz element is no longer recently updated
    })
    oldPositions.current = newPositions
  }, [anecdotesSorted])

  useEffect(() => {
    if (updatedIds.length === 0) return;
    const timers = updatedIds.map((id) => setTimeout(() => setUpdatedIds((prev) => prev.filter((x) => x !== id)), 1800));
    return () => timers.forEach(clearTimeout);
  }, [updatedIds]);
  
  return (
    <>
      <h2>Anecdotes</h2>
      {anecdotesSorted.map((anecdote, idx) => {
        const wasUpdatedId = updatedIds.find((id) => id === anecdote.id) // was this anecdote recently voted on?
        const valueDifference = wasUpdatedId && filteredAnecdotes.reduce((x, y) => y.id === wasUpdatedId ? y.votes : x, null) - anecdote.votes
        const ogAnecdote = filteredAnecdotes.find(a => a.id === anecdote.id) // to vote with the immediately updated votes(instead of the sorted delayed votes)
        return (
          <div ref={el => itemRefs.current[anecdote.id] = el} key={anecdote.id} className='anecdote' style={{ backgroundColor: valueDifference > 0 && 'rgb(12, 50, 3)' }}>
            <div>
              {anecdote.content}
            </div>
            <div>
              has {anecdote.votes} { " " }
              <button
                onClick={() => handleVote(ogAnecdote)} // original anecdote to get the correct number of votes
                style={{ backgroundColor: wasUpdatedId ? 'lightgreen' : 'lightblue', borderRadius: '1rem'}} 
                title="Click to vote for this anecdote"> vote </button>
              <span style={{ opacity: wasUpdatedId ? 1 : 0, transition: 'opacity 0.8s, color 0.8s', color:'rgb(88, 207, 187)' }}> ✓ Voted! {Boolean(valueDifference) && "+" + valueDifference} </span>
              {<div style={{ float: 'right' }}>{swapHistory[anecdote.id] ? swapHistory[anecdote.id].join(' => ') : idx + 1}</div>}
            </div>
          </div>
        )
      })} 
    </>
  )
}

export default AnecdoteList


function setTempBackground(bgTimersRef, el, id, color, revertColor, delay)  {
  clearTimeout(bgTimersRef.current[id]); // Cancel previous timer if exists
  el.style.backgroundColor = color;
  bgTimersRef.current[id] = setTimeout(() => {
    el.style.backgroundColor = revertColor;
    delete bgTimersRef.current[id]; // Clean up
  }, delay);
};

function calculatePositions(anecdotes, itemRefs) {
  const positions = {}
  anecdotes.forEach(a => { // count old positions before sorting for animation
    const domNode = itemRefs.current[a.id]
    if (domNode) {
      const rect = domNode.getBoundingClientRect()
      positions[a.id] = rect.top
    }
  })
  return positions
}