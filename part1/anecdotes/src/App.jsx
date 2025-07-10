import { useState } from 'react'

const anecdotes = [
  'If it hurts, do it more often.',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
  'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
  'The only way to go fast, is to go well.',
]

const App = () => {
  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(new Array(anecdotes.length).fill(0))
  const [mostVoted, setMostVoted] = useState(null)

  const nextAnecdote = () => {
    const getRandomInt = Math.floor(Math.random() * anecdotes.length)

    if (selected === getRandomInt) {
      return nextAnecdote()
    } else {
      setSelected(getRandomInt)
    }
  }

  const getMostVoted = (votesCopy) => {
    let winnerIndex = 0
    let maxVotes = 0
    votesCopy.forEach((el, index) => {
      if (el > maxVotes) {
        maxVotes = el
        winnerIndex = index
      }
    })
    return winnerIndex
  }

  const handleVote = () => {
    const copy = [...votes]
    copy[selected]++
    setVotes(copy)
    setMostVoted(getMostVoted(copy))
  }

  return (
    <div>
      <h1>
        <strong>Anecdote of the day</strong>
      </h1>
      <p>{anecdotes[selected]}</p>
      <p>
        It has {votes[selected]} vote{`${votes[selected] === 1 ? '' : 's'}`}
      </p>
      <button onClick={handleVote}>Vote</button>
      <button onClick={nextAnecdote}>Next anecdote</button>
      {mostVoted !== null && (
        <>
          <h1>
            <strong>Anecdote with most votes</strong>
          </h1>
          <p>{anecdotes[mostVoted]}</p>
          <p>
            It has {votes[mostVoted]} vote{`${votes[mostVoted] === 1 ? '' : 's'}`}
          </p>
        </>
      )}
    </div>
  )
}

export default App
