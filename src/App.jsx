import { useState } from 'react';
import { API_KEY } from './Api';
import spinner from './assets/Spinner.svg';
import search from './assets/Search.svg';
import './App.css';

function App() {
  const [location, setLocation] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [daysData, setDaysData] = useState(null);
  const [error, setError] = useState('');

  const fetchData = () => {
    if (location) {
      fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${location}&APPID=${API_KEY}&units=metric&lang=es`
      )
        .then((response) => {
          if (!response.ok) {
            setLocation('');
            setWeatherData(null);
            throw new Error('No se ha encontrado la ciudad');
          }
          setError('');
          return response.json();
        })
        .then((data) => {
          setWeatherData(data);

          const { lat, lon } = data.coord;

          fetch(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=es`
          )
            .then((response) => {
              if (!response.ok) {
                setLocation('');
                setDaysData(null);
                throw new Error('No se ha encontrado la ciudad');
              }
              setError('');
              return response.json();
            })
            .then((data) => setDaysData(data))
            .catch((error) => setError(error.message));
        })
        .catch((error) => setError(error.message));
    }
  };

  const hourlyForecast = daysData && daysData.list && daysData.list.slice(0, 5);

  return (
    <div className="parent">
      <div className="search">
        <label>
          <input
            type="text"
            value={location}
            onChange={(event) => {
              setLocation(event.target.value);
            }}
            placeholder="Escribe tu ubicación"
            onKeyUp={(event) => {
              if (event.key === 'Enter') {
                fetchData();
              }
            }}
          />
          <div className="searchIcon">
            <img src={search} alt="search" onClick={fetchData} />
          </div>
        </label>
      </div>
      {weatherData && (
        <div className="weatherParent">
          <div className="topInfoParent">
            <div className="cityName">
              <span>{weatherData.name}</span>
            </div>
            <div className="temperature">
              <img
                src={`http://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`}
                alt="icon"
              />
              <span>{Math.round(weatherData.main.temp)}º</span>
            </div>
            <div className="description">
              <span>{weatherData.weather[0].description}</span>
            </div>
          </div>

          <div className="separator"></div>

          <div className="otherData">
            <div className="feelMax">
              <span>Sensación: {Math.round(weatherData.main.feels_like)}º</span>
              <span>Max temp: {Math.round(weatherData.main.temp_max)}º</span>
            </div>
            <div className="humWind">
              <span>Humedad: {weatherData.main.humidity}%</span>
              <span>Viento: {Math.round(weatherData.wind.speed * 3.6)}km/h</span>
            </div>
          </div>

          {hourlyForecast && (
            <div>
              {hourlyForecast.map((hours) => (
                <div className='hoursForecastContainer' key={hours.dt}>
                  <div className='hoursForecast'>
                    <span>{hours.dt_txt.slice(8, 10)}/{hours.dt_txt.slice(5, 7)}/{hours.dt_txt.slice(0, 4)}</span>
                    <span>{hours.dt_txt.slice(11, 16)}</span>
                    <span>{Math.round(hours.main.temp)}º</span>
                    <img
                      src={`http://openweathermap.org/img/w/${hours.weather[0].icon}.png`}
                      alt="icon"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      )}
      {error && (
        <div className="error">
          <img src={spinner} alt="spinner" />
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}

export default App;
