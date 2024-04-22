import { useState, useEffect } from "react";
import axios from "axios";

const Weather = ({ pos }) => {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    axios
      .get(
        `https://api.open-meteo.com/v1/forecast?latitude=${pos[0]}&longitude=${pos[1]}&current=temperature_2m,wind_speed_10m`
      )
      .then((response) => {
        setWeather(response.data);
      });
  }, [pos]);

  return (
    weather && (
      <h3>
        current temperature: {weather.current.temperature_2m + weather.current_units.temperature_2m}, current wind
        speed: {weather.current.wind_speed_10m + weather.current_units.wind_speed_10m}
      </h3>
    )
  );
};
export default Weather;
