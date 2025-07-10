import { useState } from 'react'

const Button = ({ name, handleClick }) => {
  return <button onClick={() => handleClick((prevState) => prevState + 1)}>{name}</button>
}

const StatisticLine = (props) => {
	return (
		<tr>
			<td>
				<strong>{props.name}: </strong>
			</td>
			<td>{props.value}</td>
		</tr>
	);
};

const Statistics = ({ values }) => {
  const total = values.reduce((accum, prev) => accum + prev, 0)
  const average = (values[0] - values[2]) / total || 0
  const positivePercentage = 100 * values[0] / total || 0

	return (
		<div>
			<h2>Statistics</h2>
      {total === 0
      ? <p>No Feedback given</p>
      : <table>
				<tbody>
					<StatisticLine name="Good" value={values[0]} />
					<StatisticLine name="Neutral" value={values[1]} />
					<StatisticLine name="Bad" value={values[2]} />
					<StatisticLine name="All" value={total} />
					<StatisticLine name="Average" value={average} />
					<StatisticLine name="Positive" value={`${positivePercentage}%`} />
				</tbody>
			  </table>}
		</div>
	);
};

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <h1>Give Feedback</h1>
      <div className='btn-container' style={{ display: 'flex', gap: '1rem' }}>
        <Button name={'Good'} handleClick={setGood} />
        <Button name={'Neutral'} handleClick={setNeutral} />
        <Button name={'Bad'} handleClick={setBad} />
      </div>
      <Statistics values={[good, neutral, bad]} />
    </div>
  )
}

export default App
