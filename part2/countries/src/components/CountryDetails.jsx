import { useState, useEffect } from 'react'
import axios from 'axios'

const api_key = import.meta.env.VITE_SOME_KEY

const CountryDetails = ({ country }) => {
  const [weatherData, setWeatherData] = useState(null)
  const lat = country.capitalInfo.latlng[0]
  const lon = country.capitalInfo.latlng[1]

  useEffect(() => {
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}&units=metric&lang=en`
      )
      .then((response) => {
        setWeatherData(response.data)
      })
      .catch((error) => {
        console.error(error)
      })
  }, [])
  return (
    <div>
      <h1>{country.name.common}</h1>
      <p>
        <strong>Capital:</strong> {country.capital?.[0]}
      </p>
      <p>
        <strong>Area:</strong> {country.area}
      </p>
      <h2>Languages</h2>
      <ul>
        {country.languages &&
          Object.values(country.languages).map((lang) => <li key={lang}>{lang}</li>)}
      </ul>
      <img
        src={country.flags?.svg}
        alt={`Flag of ${country.name.common}`}
        style={{ width: '150px', marginTop: '1rem' }}
      />
      <h2>Weather in {country.name.common}</h2>
      {weatherData && (
        <div>
          <p>Temperatura: {weatherData.main.temp} °C</p>
          <img
            src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
            alt={weatherData.weather[0].description}
          />
          <p>Wind: {weatherData.wind.speed} m/s</p>
        </div>
      )}
    </div>
  )
}

export default CountryDetails
