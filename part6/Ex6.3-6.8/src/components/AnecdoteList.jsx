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

  const [anecdotesSorted, setAnecdotesSorted] = useState(filteredAnecdotes) // delay the sorting so it wont look immediate(as if through a server)
  const [history, setHistory] = useState([])
  const [historyIndex, setHistoryIndex] = useState(-1) // index of going back and forth in history
  const [, forceRender] = useState(0); // re-render to delete the "✓ Voted!" at the end of voting(since its using useRef)
  const updatedIds = useRef([]) // recently updated anecdotes temporary change color up until the sorting happens(via the setTimeout)
  const sortingTimerId = useRef(null) // to clear the timers when user clicks vote(debounce sorting)
  const timeoutsRef = useRef({}); // to remove the updatedIds after the sorting is over(cam also remove all of them in useEffect by setting .current = [])
  const bgTimers = useRef({}); // background timers
  const itemRefs = useRef({}) // animate between the before and after sorting positions
  const oldPositions = useRef({}) // save the positions of the anecdotes right after pressing "vote"
  
  const handleVote = (anecdote) => {
    dispatch(addVote(anecdote))
    updatedIds.current.push(anecdote.id) // push the voted upon anecdote id to the updatedIds array
    clearTimeout(timeoutsRef.current[anecdote.id]); // clear if this is the 2'nd+ vote in a row (1800ms haven't passed)
    timeoutsRef.current[anecdote.id] = setTimeout(() => { // timer to delete all votes on the same element
      updatedIds.current = updatedIds.current.filter(id => id !== anecdote.id);
      delete timeoutsRef.current[anecdote.id]; // Clean up
      forceRender(prev => prev + 1) // re-render
    }, 1800);
    setTempBackground(bgTimers, itemRefs.current[anecdote.id], anecdote.id, itemRefs.current[anecdote.id].style.backgroundColor, 'rgb(12, 50, 3)', 0)
  }
  
  useEffect(() => {
    if (history.length === 0) oldPositions.current = calculatePositions(anecdotesSorted, itemRefs) // set starting positions
    sortingTimerId.current = setTimeout(() => setAnecdotesSorted([...filteredAnecdotes].sort((a, b) => b.votes - a.votes)), 1500) // delay the sorting
    return () => clearTimeout(sortingTimerId.current)
  }, [filteredAnecdotes])
  
  useLayoutEffect(() => {
    const newPositions = calculatePositions(anecdotesSorted, itemRefs)
    let elementsDidSwap = false
    anecdotesSorted.forEach(a => {
      const el = itemRefs.current[a.id]
      if (!el) return
      const oldTop = oldPositions.current[a.id]
      const newTop = newPositions[a.id]
      if (oldTop !== undefined && Math.abs(oldTop - newTop) > 1) { // if this element recently changed position because of sorting
        elementsDidSwap = true
        const delta = oldTop - newTop // how much the element moved in the y axis

        el.style.transition = 'background-color 0.6s cubic-bezier(.25,.75,.57,.96)' // Remove any inline transition override so it will snap into the old position
        el.style.transform = `translateY(${delta}px)` // Offset element to old position
        void el.offsetHeight  // Force browser to apply the transform immediately
        el.style.transition = 'transform 0.3s cubic-bezier(.25,.75,.57,.96), background-color 0.6s cubic-bezier(.25,.75,.57,.96)'
        el.style.transform = 'translateY(0)'
      
        setTempBackground(bgTimers, el, a.id, 'rgb(72, 5, 33)', 'rgb(50, 3, 50)', 600); // swapped
      }
      else setTempBackground(bgTimers, el, a.id, el.style.backgroundColor, 'rgb(34, 5, 34)', 1200); // back to og color cuz element is no longer recently updated
    })
    oldPositions.current = newPositions
    if (historyIndex === history.length - 1 && ((anecdotesSorted.length > 0 && history.length === 0) || (elementsDidSwap && anecdotesSorted.length > 0))) {
      const newHistory = [...history]
      newHistory.push(anecdotesSorted)
      setHistory(newHistory)
      setHistoryIndex(prev => prev + 1)
    }
    
  }, [anecdotesSorted])

  const goHistory = (where) => {
    let newIndex = historyIndex;
    if (where === '+') newIndex++;
    else if (where === '-') newIndex--;
    if (newIndex < 0 || newIndex > history.length - 1) return;
    setHistoryIndex(newIndex);
    setAnecdotesSorted(history[newIndex]);
  };
  
  console.log("inside goHistory historyIndex: ", historyIndex);
  console.log("history", history);  

  return (
    <>
      <h2>Anecdotes</h2>
      {anecdotesSorted.map((anecdote, idx) => {
        const wasUpdatedId = updatedIds.current.find((id) => id === anecdote.id) // was this anecdote recently voted on?
        const valueDifference = wasUpdatedId && filteredAnecdotes.reduce((x, y) => y.id === wasUpdatedId ? y.votes : x, null) - anecdote.votes
        const ogAnecdote = filteredAnecdotes.find(a => a.id === anecdote.id) // to vote with the immediately updated votes(instead of the sorted delayed votes)
        const swapHistory = history.reduce((result, entry, index) => {
          index <= historyIndex && entry.forEach((a, idx) => a.id === anecdote.id && result[result.length - 1] !== idx + 1 && result.push(idx + 1))
          return result
        }, [])
        return (
          <div ref={el => itemRefs.current[anecdote.id] = el} key={anecdote.id} className='anecdote'>
            <div>
              {anecdote.content}
            </div>
            <div>
              has {anecdote.votes} { " " }
              <button
                disabled={historyIndex !== history.length - 1}
                onClick={() => handleVote(ogAnecdote)} // original anecdote to get the correct number of votes
                style={{ backgroundColor: wasUpdatedId ? 'lightgreen' : 'lightblue', borderRadius: '1rem'}} 
                title="Click to vote for this anecdote"> vote </button>
              <span style={{ opacity: wasUpdatedId ? 1 : 0, transition: 'opacity 0.8s, color 0.8s', color:'rgb(88, 207, 187)' }}> ✓ Voted! {Boolean(valueDifference) && "+" + valueDifference} </span>
              {<div style={{ float: 'right' }}>{swapHistory?.length > 0 ? swapHistory.join(' => ') : idx + 1}</div>}
            </div>
          </div>
        )
      })}
      <button onClick={() => goHistory('+')}>forward</button>
      <button onClick={() => goHistory('-')}>backward</button>
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