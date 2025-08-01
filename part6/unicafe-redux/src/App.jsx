import { useSelector, useDispatch } from 'react-redux'

const App = () => {
  const counter = useSelector((state) => state)
  const dispatch = useDispatch()

  return (
    <div>
      <h1>Give feedback:</h1>
      <button onClick={() => dispatch({ type: 'GOOD' })}>Good</button>
      <button onClick={() => dispatch({ type: 'OK' })}>Ok</button>
      <button onClick={() => dispatch({ type: 'BAD' })}>Bad</button>
      <button onClick={() => dispatch({ type: 'ZERO' })}>Reset stats</button>

      <h1>Statistics</h1>
      <div>Good {counter.good}</div>
      <div>Ok {counter.ok}</div>
      <div>Bad {counter.bad}</div>
    </div>
  )
}

export default App
