import { useState } from 'react';
import { API_KEY } from './Api';
import spinner from './assets/Spinner.svg';
import search from './assets/Search.svg';
import sunnyBackground from './assets/sunny.jpg';
import rainyBackground from './assets/rainy.jpg';
import cloudyBackground from './assets/cloudy.jpg';
import './App.css';

function App() {
  const [location, setLocation] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [daysData, setDaysData] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = () => {
    if (location) {
      setIsLoading(true);

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
            .catch((error) => setError(error.message))
            .finally(() => setIsLoading(false));
        })
        .catch((error) => setError(error.message))
        .finally(() => setIsLoading(false));
    }
  };

  const hourlyForecast = daysData && daysData.list && daysData.list.slice(0, 5);
  /* al utilizar esta expresión, se verifica que daysData y daysData.list existan 
  antes de aplicar el método slice(0, 5) para obtener los primeros 5 elementos de daysData.list*/

  // tipos de clima e imágenes de fondo correspondientes
  const weatherBackgrounds = {
    Clear: sunnyBackground,
    Rain: rainyBackground,
    Clouds: cloudyBackground,
  };

  // Determina el fondo actual basado en el tipo de clima
  const getCurrentBackground = () => {
    if (weatherData && weatherData.weather && weatherData.weather.length > 0) {
      const weatherType = weatherData.weather[0].main;
      return weatherBackgrounds[weatherType] || null;
    }
    return null;
  };

  const currentBackground = getCurrentBackground();


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
      {isLoading && (
        <div className="loading">
          <img src={spinner} alt="spinner" />
        </div>
      )}
      {weatherData && (
        <div className="weatherParent" style={{ backgroundImage: `url(${currentBackground})` }}>
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
                <div className="hoursForecastContainer" key={hours.dt}>
                  <div className="hoursForecast">
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
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}

export default App;
