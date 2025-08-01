/* eslint-disable react/prop-types */
import { useState } from 'react'

const AnecdoteForm = ({ onCreate }) => {
  const [content, setContent] = useState('')

  const onSubmit = (e) => {
    e.preventDefault()
    onCreate(content)
    setContent('')
  }

  return (
    <form onSubmit={onSubmit}>
      <input value={content} onChange={(e) => setContent(e.target.value)} />
      <button type='submit'>create</button>
    </form>
  )
}

export default AnecdoteForm
