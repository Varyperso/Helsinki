import { anecdoteFilter } from '../reducers/anecdoteFilterSlice'
import { useDispatch } from 'react-redux'

const FilterAnecdotes = () => {

  const dispatch = useDispatch()
  const handleChange = ({ target }) => dispatch(anecdoteFilter(target.value))

  return (
    <div>
      filter <input onChange={handleChange} />
    </div>
  )
}

export default FilterAnecdotes