import { useState } from 'react';
import { API_KEY } from './Api';
import spinner from './assets/Spinner.svg'
import search from './assets/Search.svg'
import './App.css';

function App() {
  const [location, setLocation] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState('');

  const fetchData = () => {
    if (location) {
      fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${location}&APPID=${API_KEY}&units=metric`
      )
      .then((response) => {
        if (!response.ok) {
          setLocation('')
          setWeatherData(null)
          throw new Error('City not found')
        }
        setError('')
        return response.json();
      })
        .then((data) => setWeatherData(data))
        .catch((error) => setError(error.message))
    }
  }

  return (
    <div className='parent'>
    <div className='search'>
      <input
        type="text"
        value={location}
        onChange={(event) => {
          setLocation(event.target.value)
        }}
        placeholder="Write your city name"
        onKeyUp={(event) => {
          if (event.key === 'Enter') {
            fetchData()
          }
        }}
      />
      <img src={search} alt='search' onClick={fetchData}></img>
      </div>
      {weatherData && (
        <div>
          <h2>{weatherData.name}</h2>
          <p>{Math.round(weatherData.main.temp)} ºC</p>
          <p>{weatherData.weather[0].main}</p>
        </div>
      )}
      {error && (
        <div className='error'>
          <img src={spinner} alt='spinner'></img>
          <p>{error}</p>
        </div>)}
    </div>
  )
}

export default App;
