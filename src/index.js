let now = new Date();

let h6 = document.querySelector("h6#currentDayCard");
let hours = now.getHours();
let minutes = ("0" + now.getMinutes()).slice(-2);
let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
let day = days[now.getDay()];
h6.innerHTML = `${day} ${hours}:${minutes}`;

function searchCity(event) {
  event.preventDefault();
  let searchInput = document.querySelector("#citySearchBox").value;
  let cityLabel = document.querySelector("#currentCity");
  cityLabel.innerHTML = searchInput;

  function displayWeather(response) {
    let currentTemperature = document.querySelector(".today-temperature");
    let currentWeatherComment = document.querySelector(".today-comment");
    let currentLowTemp = document.querySelector(".current-low-temperature");
    let currentHumidity = document.querySelector(".current-humidity");
    let currentWindSpeed = document.querySelector(".current-wind-speed");
    let iconElement = document.querySelector("#current-day-icon");
    currentTemperature.innerHTML = Math.round(response.data.main.temp);
    currentWeatherComment.innerHTML = response.data.weather[0].description;
    currentLowTemp.innerHTML = `${Math.round(response.data.main.temp_min)}°`;
    currentHumidity.innerHTML = `${response.data.main.humidity}%`;
    currentWindSpeed.innerHTML = `${Math.round(
      response.data.wind.speed * 3.6
    )} km/h`;

    iconElement.setAttribute(
      "src",
      `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
    );
    iconElement.setAttribute("alt", response.data.weather[0].description);

    function convertCelsius(event) {
      event.preventDefault();
      let h3 = document.querySelector(".today-temperature");
      let currentLowTempCelsius = document.querySelector(
        ".current-low-temperature"
      );

      h3.innerHTML = Math.round(response.data.main.temp);
      currentLowTempCelsius.innerHTML = `${Math.round(
        response.data.main.temp_min
      )}°`;
    }
    let celsiusTemperature = document.querySelector("#celsiusLink");
    celsiusTemperature.addEventListener("click", convertCelsius);

    function convertFahrenheit(event) {
      event.preventDefault();
      let h3 = document.querySelector(".today-temperature");
      let currentLowTempFahrenheit = document.querySelector(
        ".current-low-temperature"
      );
      let lowFahrenheitTemp = Math.round(response.data.main.temp_min);
      h3.innerHTML = Math.round(
        (Math.round(response.data.main.temp) * 9) / 5 + 32
      );

      currentLowTempFahrenheit.innerHTML = `${Math.round(
        (lowFahrenheitTemp * 9) / 5 + 32
      )}°`;
    }
    let fahrenheitTemperature = document.querySelector("#fahrenheitLink");
    fahrenheitTemperature.addEventListener("click", convertFahrenheit);
  }

  let city = searchInput;
  let key = "8d9838178b5b401f1b4e7cb5af18e210";
  let currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}&units=metric`;

  axios.get(currentWeatherUrl).then(displayWeather);
}

let form = document.querySelector("form");
form.addEventListener("submit", searchCity);
