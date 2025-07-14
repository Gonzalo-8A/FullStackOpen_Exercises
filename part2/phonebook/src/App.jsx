import { useEffect, useState } from 'react'
import axios from 'axios'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons.jsx'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [filter, setFilter] = useState('')

  useEffect(() => {
    axios.get('http://localhost:3001/persons')
      .then(response => {
        setPersons(response.data)
      })
  }, [])

  const addNewPhone = (event) => {
    event.preventDefault()
    if(newName === '' || newPhone === ''){
      return
    }
    const isAlreadyAdded = persons.find(el => el.name === newName)
    if(isAlreadyAdded) {
      alert(`${newName} is already added to phonebook`)
      return
    }

    const newPerson = {
      name: newName,
      number: newPhone
    }

    setPersons(prev => prev.concat(newPerson))
    setNewName('')
    setNewPhone('')
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handlePhoneChange = (event) => {
    setNewPhone(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const filteredPersons = persons.filter(p => p.name.includes(filter))

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter value={filter} onChange={handleFilterChange} />
      <h2>Add a new Contact</h2>
      <PersonForm
        onSubmit={addNewPhone}
        nameValue={newName}
        onNameChange={handleNameChange}
        phoneValue={newPhone}
        onPhoneChange={handlePhoneChange}
      />
      <h2>Numbers</h2>
    <Persons filteredPersons={filteredPersons}/>
    </div>
  )
}

export default App
