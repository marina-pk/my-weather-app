let dailyParamsCard = `
        <div class="col-2">
          <div class="card" id="daily-parameters">
            <div class="card-header"></div>
            <div class="card-body">
              <ul class="list-group list-group-horizontal">
                <li class="list-group-item">
                  <i class="fas fa-temperature-low"></i>Low </i>
                </li>
              </ul>
              <ul class="list-group list-group-horizontal-sm">
                <li class="list-group-item"><i class="fas fa-tint"></i> Humidity </li>
              </ul>
              <ul class="list-group list-group-horizontal-md">
                <li class="list-group-item">
                  <i class="fas fa-wind"></i>Wind 
                </li>
              </ul>
            </div>
          </div>
        </div>
`;

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

  function formatDay(timestamp) {
    let date = new Date(timestamp * 1000);
    let day = date.getDay();
    let days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    return days[day];
  }

  function displayForecast(response) {
    console.log(now.getDay());
    let forecast = response.data.daily;

    let forecastElement = document.querySelector("#forecast");

    let forecastHTML = `<div class="row">`;
    let forecastHTMLCards = ``;
    forecast.forEach(function (forecastDay, index) {
      if (index < 6 && days[now.getDay()] != formatDay(forecastDay.dt)) {
        forecastHTMLCards =
          forecastHTMLCards +
          `
      <div class="col-2">
          <div class="card text-center daily-stats-card">
            <div class="card-header">
              <h6 class="card-subtitle mb-2 text-muted">${formatDay(
                forecastDay.dt
              )}</h6>
              <img
                src="http://openweathermap.org/img/wn/${
                  forecastDay.weather[0].icon
                }@2x.png"
                class="card-img-top"
                alt="weather-icon"
              />
              <br />
              <h3>${Math.round(forecastDay.temp.day)}°</h3>
              <small>${forecastDay.weather[0].description}</small>
            </div>
            <div class="card-body">
              <ul class="list-group list-group-horizontal">
                <li class="list-group-item">${Math.round(
                  forecastDay.temp.min
                )}°</li>
              </ul>
              <ul class="list-group list-group-horizontal-sm">
                <li class="list-group-item">${forecastDay.humidity}%</li>
              </ul>
              <ul class="list-group list-group-horizontal-md">
                <li class="list-group-item">${Math.round(
                  forecastDay.wind_speed * 3.6
                )} km/h</li>
              </ul>
            </div>
          </div>
        </div>
  `;
      }
    });

    forecastHTML =
      forecastHTML + dailyParamsCard + forecastHTMLCards + `</div>`;
    forecastElement.innerHTML = forecastHTML;
  }

  function getForecast(coordinates) {
    let apiKey = "8d9838178b5b401f1b4e7cb5af18e210";
    let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
    axios.get(apiUrl).then(displayForecast);
  }

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
      celsiusLink.classList.add("active");
      fahrenheitLink.classList.remove("active");
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
      celsiusLink.classList.remove("active");
      fahrenheitLink.classList.add("active");
    }

    let fahrenheitTemperature = document.querySelector("#fahrenheitLink");
    fahrenheitTemperature.addEventListener("click", convertFahrenheit);
    getForecast(response.data.coord);
  }

  let city = searchInput;
  let key = "8d9838178b5b401f1b4e7cb5af18e210";
  let currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}&units=metric`;

  axios.get(currentWeatherUrl).then(displayWeather);
}

let form = document.querySelector("form");
form.addEventListener("submit", searchCity);
