import { useState, useRef, useLayoutEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addVote, removeAnecdote } from '../reducers/anecdoteSlice'
import useHistory from '../hooks/useHistory'
import useCalculatePositions, { calculatePositions } from '../hooks/useCalcualtePositions'

const AnecdoteList = ({ history, setHistory, historyIndex, setHistoryIndex }) => {
  const dispatch = useDispatch()
  const anecdotes = useSelector(state => state.anecdotes)
  const filter = useSelector(state => state.anecdotesFilter)
  const filteredAnecdotes = useMemo(() => anecdotes.filter(a => a.content.toLowerCase().includes(filter.toLowerCase())), [anecdotes, filter])

  const [, forceRender] = useState(0); // re-render to delete the "✓ Voted!" at the end of voting(since its using useRef)
  const updatedIds = useRef([]) // recently updated anecdotes temporary change color up until the sorting happens(via the setTimeout)
  const timeoutsRef = useRef({}); // remove the updatedIds after the sorting is over
  const bgTimers = useRef({}); // background color timers

  const { anecdotesSorted, setAnecdotesSorted, oldPositions, itemRefs } = useCalculatePositions(filteredAnecdotes)
  const onHistoryTraverse = useHistory(historyIndex, history, setHistoryIndex, setAnecdotesSorted)
  
  const handleVote = (anecdote) => {
    if (historyIndex !== history.length - 1) onHistoryTraverse('>>') // if currently going through history, go back to current time
    dispatch(addVote(anecdote))
    updatedIds.current.push(anecdote.id) // push the voted upon anecdote id to the updatedIds array
    clearTimeout(timeoutsRef.current[anecdote.id]); // clear if this is the 2'nd+ vote in a row (1800ms haven't passed)
    timeoutsRef.current[anecdote.id] = setTimeout(() => { // timer to delete all consecutive votes on the same anecdote
      updatedIds.current = updatedIds.current.filter(id => id !== anecdote.id);
      delete timeoutsRef.current[anecdote.id]; // Clean up
      forceRender(prev => prev + 1) // re-render
    }, 1800);
    setTempBackground(bgTimers, itemRefs.current[anecdote.id], anecdote.id, itemRefs.current[anecdote.id].style.backgroundColor, 'rgb(12, 50, 3)', 0)
  }

  const handleDeleteAnecdote = (anecdote) => {
    if (historyIndex !== history.length - 1) onHistoryTraverse('>>') // if currently going through history, go back to current time
    const el = itemRefs.current[anecdote.id]
    el.style.transition = 'opacity 1s ease'
    el.style.opacity = '0'
    const contentDiv = el.querySelector('.anecdoteContent')
    contentDiv.style.color = 'red'
    if (contentDiv) contentDiv.textContent += ' (removing...)'
    setTimeout(() => {
      dispatch(removeAnecdote(anecdote))
      delete timeoutsRef.current[anecdote.id]; // dont know if need this cleanup but maybe?
    }, 1000)
  }

  useLayoutEffect(() => {
    if (anecdotesSorted.length === 0) return // need anecdotesSorted for this
    if (history.length === 0) { setHistory([anecdotesSorted]); return } // init the first history array and return
    const newPositions = calculatePositions(anecdotesSorted, itemRefs)
    anecdotesSorted.forEach(a => {
      const el = itemRefs.current[a.id]
      if (!el) return
      
      const isElementNew = history.length > 0 && !history[history.length - 1].find(anecdote => a.id === anecdote.id)
      if (isElementNew) {
        el.style.opacity = '0'
        requestAnimationFrame(() => {
          el.style.transition = 'opacity 1s ease'
          el.style.opacity = '1'
        })
        return
      }

      const oldTop = oldPositions.current[a.id]
      const newTop = newPositions[a.id]

      if (oldTop !== undefined && Math.abs(oldTop - newTop) > 30) { // 30px to compensate for height differences between elements
        const delta = oldTop - newTop // how much the element moved in the y axis
        
        el.style.transition = 'background-color 0.6s cubic-bezier(.25,.75,.57,.96)' // remove inline transform transition so element snap into old position
        el.style.transform = `translateY(${delta}px)` // Offset element to old position
        void el.offsetHeight  // Force browser to apply the transform immediately
        el.style.transition = 'transform 0.3s cubic-bezier(.25,.75,.57,.96), background-color 0.6s cubic-bezier(.25,.75,.57,.96)'
        el.style.transform = 'translateY(0)'
        setTempBackground(bgTimers, el, a.id, 'rgb(72, 5, 33)', 'rgb(50, 3, 50)', 600); // swapped
      }
      else setTempBackground(bgTimers, el, a.id, el.style.backgroundColor, 'rgb(34, 5, 34)', 1200); // back to og color - element no longer recently updated
    })
    oldPositions.current = newPositions

    const last = history[history.length - 1]
    if (historyIndex !== history.length - 1 || filter || JSON.stringify(last) === JSON.stringify(history[history.length - 2])) return // if we're scrolling through history or filtering, don't push new history

    const sameLength = anecdotesSorted.length === last.length
    const sameIds = anecdotesSorted.every((a, i) => a.id === last[i]?.id) // deleted then added an element, now sameLength === true, so need to compare id's
    if (!sameLength || !sameIds) {
      const newHistory = [...history, anecdotesSorted]
      setHistory(newHistory)
      setHistoryIndex(newHistory.length - 1)
    }
    else setHistory(prev => [...prev.slice(0, -1), anecdotesSorted]) // if the vote didnt cause a swap, just update the vote in the last history array
  }, [anecdotesSorted])
  
  console.log("history", history);

  return (
    <>
      <h2>Anecdotes</h2>
      <button onClick={() => onHistoryTraverse('<')}>&lt;</button> {" "}
      <button onClick={() => onHistoryTraverse('>')}>&gt;</button> {" "}
      <button onClick={() => onHistoryTraverse('<<')}>&lt;&lt;</button> {" "}
      <button onClick={() => onHistoryTraverse('>>')}>&gt;&gt;</button> {" "}
      {history.length > 1 && <span>{historyIndex} / {history.length - 1}</span>}
      {anecdotesSorted.map((anecdote, idx) => {
        const wasUpdatedId = updatedIds.current.find((id) => id === anecdote.id) // get anecdote id if it was recently voted on
        const valueDifference = wasUpdatedId && filteredAnecdotes.reduce((x, y) => y.id === wasUpdatedId ? y.votes : x, null) - anecdote.votes
        const ogAnecdote = filteredAnecdotes.find(a => a.id === anecdote.id) // to vote with the fresh updated votes(instead of the sorted delayed votes)
        const existsNow = history.length && history[history.length - 1].find(a => a.id === anecdote.id) // not deleted
        const swapHistory = history.reduce((result, entry, index) => {
          index <= historyIndex && entry.forEach((a, idx) => a.id === anecdote.id && result[result.length - 1] !== idx + 1 && result.push(idx + 1))
          return result
        }, [])
        return (
          <div ref={el => itemRefs.current[anecdote.id] = el} key={anecdote.id} className='anecdote' >
            <div className='anecdoteContent'>
              {anecdote.content}
              <span style={{ float: 'right' }}>{idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : null}</span>
            </div>
            <div>
              <span>has {anecdote.votes} </span>
              <button disabled={!existsNow} onClick={() => handleVote(ogAnecdote)}> vote </button> {" "}
              <button disabled={!existsNow} onClick={() => handleDeleteAnecdote(anecdote)}> delete </button>
              <span style={{ opacity: wasUpdatedId ? 1 : 0, transition: 'opacity 0.8s', color:'rgb(164, 154, 255)' }}> ✓ Voted! {valueDifference > 0 && "+" + valueDifference} </span>
              {<span style={{ float: 'right', paddingRight: '0.4rem' }}>{swapHistory?.length > 5 ? '... ' + swapHistory.slice(swapHistory.length - 5, swapHistory.length).join(' => ') : swapHistory?.length > 0 ? swapHistory.join(' => ') : null}</span>}
            </div>
          </div>
        )
      })}
    </>
  )
}

export default AnecdoteList

function setTempBackground(bgTimersRef, el, id, color, revertColor, delay) {
  clearTimeout(bgTimersRef.current[id]) // Cancel previous timer if exists
  el.style.backgroundColor = color
  bgTimersRef.current[id] = setTimeout(() => {
    el.style.backgroundColor = revertColor
    delete bgTimersRef.current[id] // Clean up
  }, delay)
};