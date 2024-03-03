const api = "https://weather-proxy.freecodecamp.rocks/";
let isCelsius = true;

async function fetchWeatherData(latitude, longitude) {
  try {
    const response = await fetch(
      `${api}api/current?lat=${latitude}&lon=${longitude}`,

    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    throw error;
  }
}


async function getLocationAndDisplayWeather() {
  try {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const localLatitude = position.coords.latitude;
        // console.log({ localLatitude });
        const localLongitude = position.coords.longitude;
        await fetchAndDisplayWeather(localLatitude, localLongitude);
      });
    } else {
      throw new Error("Geolocation is not available on this device.");
    }
  } catch (error) {
    console.error("Error getting location and displaying weather:", error);
  }
}

async function fetchAndDisplayWeather(latitude, longitude) {
  try {
    const weatherInfo = await fetchWeatherData(latitude, longitude);
    // console.log({ weatherInfo });

    const localfeelLike = weatherInfo.main.feels_like;
    const locaCityCountry = weatherInfo.sys.country;
    const weatherInfoElement = document.getElementById("weather-info");
    const localCityName = weatherInfo.name;

    const temperature = isCelsius
      ? weatherInfo.main.temp
      : (weatherInfo.main.temp * 9) / 5 + 32;
    const unit = isCelsius ? "°C" : "°F";

    const weatherHTML = `
      <h3>Local Weather: ${localCityName},${locaCityCountry}</h3>
      <p>Temperature: ${temperature.toFixed(1)} ${unit}
        <br>Feels Like: ${localfeelLike}°C
      </p>
      <p>Weather: ${weatherInfo.weather[0].main}</p>
      <img src="${weatherInfo.weather[0].icon}" alt="Weather Icon">
    `;

    weatherInfoElement.innerHTML = weatherHTML;
  } catch (error) {
    console.error("Error fetching and displaying weather:", error);
  }
}



async function fetchAndDisplayCityWeather(cityName, latitude, longitude) {
  try {
    const cityWeatherInfo = await fetchWeatherData(latitude, longitude);
    // console.log(cityWeatherInfo);
    const feelLike = cityWeatherInfo.main.feels_like;

    const cityCountry = cityWeatherInfo.sys.country;

    const cityListElement = document.getElementById("city-list");
    const temperature = isCelsius
      ? cityWeatherInfo.main.temp
      : (cityWeatherInfo.main.temp * 9) / 5 + 32;
    const unit = isCelsius ? "°C" : "°F";

    const cityHTML = `
      <div class="city">
        <h4>${cityName},${cityCountry}</h4>
        <p>Temperature: ${temperature.toFixed(1)} ${unit},
         <br>Feels Like: ${feelLike}°C
        </p>
        <p>Weather: ${cityWeatherInfo.weather[0].main}</p>
        <img src="${cityWeatherInfo.weather[0].icon}" alt="City Weather Icon">
      </div>
    `;
    cityListElement.insertAdjacentHTML("beforeend", cityHTML);
  } catch (error) {
    console.error("Error fetching and displaying city weather:", error);
    // Handle the error as needed
  }
}

function toggleTemperatureUnit() {
  isCelsius = !isCelsius;
  const cities = [
    { name: "New York", lat: 40.7128, lon: -74.006 },
    { name: "London", lat: 51.5074, lon: -0.1278 },
    { name: "Tokyo", lat: 35.682839, lon: 139.759455 },
    { name: "Mumbai", lat: 19.076, lon: 72.8777 },
    { name: "Delhi", lat: 28.6139, lon: 77.209 },
    { name: "Sydney", lat: -33.8688, lon: 151.2093 },
    { name: "Chicago", lat: 41.8781, lon: -87.6298 },
    { name: "Toronto", lat: 43.65107, lon: -79.347015 }
    // Add more cities here
  ];
  document.getElementById("city-list").innerHTML = "";
  cities.forEach((city) =>
    fetchAndDisplayCityWeather(city.name, city.lat, city.lon)
  );
  getLocationAndDisplayWeather();
}

function show() {
  getLocationAndDisplayWeather();

  //event listener to the toggle button
  const toggleButton = document.getElementById("toggle-unit");
  toggleButton.addEventListener("click", toggleTemperatureUnit);

  const cities = [
    { name: "New York", lat: 40.7128, lon: -74.006 },
    { name: "London", lat: 51.5074, lon: -0.1278 },
    { name: "Tokyo", lat: 35.682839, lon: 139.759455 },
    { name: "Mumbai", lat: 19.076, lon: 72.8777 },
    { name: "Delhi", lat: 28.6139, lon: 77.209 },
    { name: "Sydney", lat: -33.8688, lon: 151.2093 },
    { name: "Chicago", lat: 41.8781, lon: -87.6298 },
    { name: "Toronto", lat: 43.65107, lon: -79.347015 }
    // Add more cities here
  ];

  cities.forEach((city) =>
    fetchAndDisplayCityWeather(city.name, city.lat, city.lon)
  );
}

document.addEventListener("DOMContentLoaded", show());
