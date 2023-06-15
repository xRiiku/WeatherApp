import { useState } from 'react';
import { API_KEY } from './Api';
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
    <div>
      <input
        type="text"
        value={location}
        onChange={(event) => {
          setLocation(event.target.value)
        }}
        placeholder="Write your city name"
      />
      <button onClick={fetchData}>Search</button>
      {weatherData && (
        <div>
          <h2>Weather in {weatherData.name}</h2>
          <p>Temperature: {weatherData.main.temp} ºC</p>
          <p>Description: {weatherData.weather[0].description}</p>
        </div>
      )}
      {error && <p>Error: {error}</p>}
    </div>
  )
}

export default App;
