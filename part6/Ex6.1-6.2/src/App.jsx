import { good, ok, bad, zero } from './reducers/counterReducer'
import { useSelector, useDispatch } from 'react-redux'

const App = () => {
  const dispatch = useDispatch()
  const counter = useSelector(state => state)

  return (
    <>
      <div>
        <button onClick={() => dispatch(good())}>good</button> 
        <button onClick={() => dispatch(ok())}>ok</button> 
        <button onClick={() => dispatch(bad())}>bad</button>
        <button onClick={() => dispatch(zero())}>reset stats</button>
        <div>good {counter.good}</div>
        <div>ok {counter.ok}</div>
        <div>bad {counter.bad}</div>
      </div>
    </>
  )
}

export default App