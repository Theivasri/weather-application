import { useEffect, useState } from 'react';
import cloudy from '../assets/images/cloudy.png';
import Rainy from "../assets/images/Rainy.png";
import sunny from "../assets/images/sunny.png";
import Winter from "../assets/images/Winter.png";
import loadingimg from "../assets/images/loadingimg.gif";
import './weatherapps.css';

const WeatherApp = () => {
  const [data, setData] = useState({});
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const api_key = "e6e2ea658a44a51499cd7787ec55cc48";

  useEffect(() => {
    setLoading(true);
    const fetchDefaultweather = async () => {
      const defaultLocation = "Coimbatore";
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${defaultLocation}&units=Metric&appid=${api_key}`;
      const res = await fetch(url);
      const defaultData = await res.json();
      setData(defaultData);
      setLoading(false);
    }
    fetchDefaultweather();
  }, []);

  const handleInputchange = (event) => {
    setLocation(event.target.value);
  };
 
  const search = async () => {      // func is async -> it post execution to wait for async oper to ccmplete without blocking executin of other code
    if(location.trim() !== ""){
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=Metric&appid=${api_key}`;
      const res = await fetch(url); // to fetch the response from the url it will wait for the response
      const search_data = await res.json();  // response converted to json format
      console.log(search_data);
      if(search_data.cod != "200"){
        setData({notfound: true});
      }
      else{
        setData(search_data);
        setLocation("");
      }
      setLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if(event.key === "Enter"){
      search();
    }
  }

  const weatherImages = {
    Clear: sunny,
    Clouds: cloudy,
    Rain: Rainy,
    Snow: Winter,
    Haze: cloudy,
    Mist: cloudy,
  };

  const weatherImage = data.weather ? weatherImages[data.weather[0].main] : null;

  const backgroundImages = {
    Clear: 'linear-gradient(to right, #faa05b, #fac665)',
    Clouds: 'linear-gradient(to right, #57d6d4, #71eeec)',
    Rain: 'linear-gradient(to right, #5bc8fb, #80eaff)',
    Snow: 'linear-gradient(to right, #aff2ff, #fff)',
    Haze: 'linear-gradient(to right, #57d6d4, #71eeec)',
    Mist: 'linear-gradient(to right, #57d6d4, #71eeec)',
  }
  const backgroundImage  = data.weather ? backgroundImages[data.weather[0].main] : 'linear-gradient(to right, #faa05b, #fac665)';

  const currentDate = new Date();
  const Daysofweek = [ "Sun" , "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const dayofWeek = Daysofweek[currentDate.getDay()];
  const month = months[currentDate.getMonth()];
  const date = currentDate.getDate();

  const formatedDate = `${dayofWeek}, ${month}, ${date}`;

  return (
    <div className="container" style={{backgroundImage}}>
      <div className="weather-app" style={{backgroundImage : backgroundImage && backgroundImage.replace ? backgroundImage.replace("to right", "to top") : null}}>
        <div className="search">
          <div className="search-top">
            <i className="fa-solid fa-location-dot"></i>
            <div className="location">{data.name}</div>
          </div>
          <div className="search-box">
            <input type="text" placeholder="Enter Location" value={location} onChange={handleInputchange} onKeyDown={handleKeyDown}/>
            <i class="fa-solid fa-magnifying-glass" onClick={search}></i>
          </div>
        </div>
        {loading ? (<img className='loader' src={loadingimg} alt='loading' />) :
        (data.notfound ? (<div className='notfound'>Not Found 🤕</div>) : 
        <>
          <div className="weather">
            <img src={weatherImage} alt="Sunny" />
            <div className="weather-type">{data.weather ? data.weather[0].main : null}</div>
            <div className="temp"><b>{ data.main ? `${Math.floor(data.main.temp)}c` : null }</b></div>  
          </div>
        <div className="weather-date">
          <p>{formatedDate}</p>
        </div>
        <div className="weather-data">
          <div className="humidity">
            <div className="data-name">Humidity</div>
            <i className="fa-solid fa-droplet"></i>
            <div className="data">{data.main ? data.main.humidity : null}%</div>
          </div>
          <div className="wind">
            <div className="data-name">Wind</div>
            <i className="fa-solid fa-wind"></i>
            <div className="data">{data.wind ? data.wind.speed :null} km/hr</div>
          </div>
        </div>  
        </>)}
      </div>
    </div>
  );
}

export default WeatherApp