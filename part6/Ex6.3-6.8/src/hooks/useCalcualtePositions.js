import { useEffect, useRef, useState } from "react"

function calculatePositions(anecdotes, itemRefs) {
  const positions = {}
  anecdotes.forEach(a => { // count old positions before sorting for animation
    const domNode = itemRefs.current[a.id]
    if (domNode) {
      const rect = domNode.getBoundingClientRect()
      positions[a.id] = rect.top + window.scrollY
    }
  })
  return positions
}

export default function useCalculatePositions(filteredAnecdotes) {
  const [anecdotesSorted, setAnecdotesSorted] = useState([]) // delay the sorting so it wont look immediate(for demonstration purposes)

  const oldPositions = useRef({}) // save the positions of the anecdotes right after pressing "vote"
  const sortingTimerId = useRef(null) // clear the timers when user clicks vote(debounce sorting)
  const itemRefs = useRef({}) // animate between the before and after sorting positions(if there was a swap/add/delete)

  useEffect(() => {
    oldPositions.current = calculatePositions(anecdotesSorted, itemRefs) // set starting positions
    sortingTimerId.current = setTimeout(() => setAnecdotesSorted([...filteredAnecdotes].sort((a, b) => b.votes - a.votes)), 1200) // delay the sorting
    return () => clearTimeout(sortingTimerId.current)
  }, [filteredAnecdotes])

  return { anecdotesSorted, oldPositions, setAnecdotesSorted, itemRefs }
}

export { calculatePositions }