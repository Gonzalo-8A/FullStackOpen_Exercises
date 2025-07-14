import { useState, useEffect } from 'react'
import axios from 'axios'
import CountryDetails from './components/CountryDetails'

const apiURL = 'https://studies.cs.helsinki.fi/restcountries/api/all'

function App() {
  const [countries, setCountries] = useState([])
  const [fetch, setFetch] = useState([])
  const [filter, setFilter] = useState('')

  useEffect(() => {
    axios.get(apiURL).then((response) => {
      setFetch(response.data)
    })
  }, [])

  useEffect(() => {
    if (filter === '' || fetch.length === 0) {
      setCountries([])
      return
    }

    setCountries(
      fetch.filter((country) => country.name.common.toLowerCase().includes(filter.toLowerCase()))
    )
  }, [filter, fetch])

  const handleInputChange = (event) => {
    const newFilter = event.target.value
    setFilter(newFilter)
  }

  const renderCountry = (country) => {
    setCountries([country])
  }

  let content = null

  if (countries.length > 10) {
    content = <p>Too many matches, specify another filter</p>
  } else if (countries.length === 1) {
    content = <CountryDetails country={countries[0]} />
  } else if (countries.length > 1) {
    content = countries.map((country) => (
      <div key={country.name.common}>
        <p style={{ display: 'inline', marginRight: '10px' }} key={country.name.common}>
          {country.name.common}
        </p>
        <button style={{ cursor: 'pointer' }} onClick={() => renderCountry(country)}>
          Show
        </button>
      </div>
    ))
  }

  return (
    <>
      <div>
        Find Countries
        <input type='text' onChange={handleInputChange} />
      </div>
      <div>
        <div className='h2'>Results:</div>
        {content}
      </div>
    </>
  )
}

export default App
