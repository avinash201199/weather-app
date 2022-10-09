import Capitals from "./Capitals.js";
import CITY from "./City.js";
const AIR_KEY = "427f7ef80457a39a26407e17ef0d604339190901";
import languages from "../../lang/translation.js";
var userLang;
Object.keys(languages).includes(navigator.language) === true ? userLang = navigator.language : userLang = "en-US";

const place = document.querySelector("#place");

for (var i in CITY) {
  var option = document.createElement("option");
  option.value = CITY[i];
  option.text = CITY[i];
  place.appendChild(option);
}
function formatAMPM(date) {
  let strTime = date.toLocaleString('en-US', { hour: 'numeric', minute : 'numeric', hour12: true });
  return strTime;
}

const AirQuality = (log, lat) => {
  fetch(`https://api.waqi.info/feed/geo:${lat};${log}/?token=${AIR_KEY}`)
    .then((res) => res.json())
    .then((res) => {
      let aqi = res.data.aqi;
      document.querySelector("#AirQuality").innerText = `${languages[userLang].airQuality}:${aqi}`;
      if (aqi >= 0 && aqi <= 50) {
        document.querySelector(".ml-0").innerText = `(${languages[userLang].good})`;
      }
      if (aqi > 50 && aqi <= 100) {
        document.querySelector(".ml-0").innerText = `(${languages[userLang].satisfactory})`;
      }
      if (aqi > 100 && aqi <= 150) {
        document.querySelector(".ml-0").innerText = `(${languages[userLang].sensitive})`;
      }
      if (aqi > 150 && aqi <= 200) {
        document.querySelector(".ml-0").innerText = `(${languages[userLang].unhealthy})`;
      }
      if (aqi > 200 && aqi <= 300) {
        document.querySelector(".ml-0").innerText = `(${languages[userLang].veryUnhealthy})`;
      }
      if (aqi > 300) {
        document.querySelector(".ml-0").innerText = `(${languages[userLang].hazardous})`;
      }
    });
};

let weather = {
  apiKey: "20a36f8e1152244bbbd9ac296d3640f2",
  fetchWeather: function (city) {
    let isCountry = false;
    let index;
    for (let i = 0; i < Capitals.length; i++) {
      if (Capitals[i].country.toUpperCase() == city.toUpperCase()) {
        isCountry = true;
        index = i;
        break;
      }
    }
    if (isCountry) {
      city = Capitals[index].city;
    }
    fetch(
      "https://api.openweathermap.org/data/2.5/weather?q=" +
        city +
        "&units=metric&appid=" +
        this.apiKey +
        `&lang=${languages[userLang].apiLang}`
    )
      .then((response) => {
        if (!response.ok) {
          toastFunction(`${languages[userLang].noWeatherFound}`);
          throw new Error(`${languages[userLang].noWeatherFound}`);
        }
        return response.json();
      })
      .then((data) => {
        this.displayWeather(data);
      });
  },
  displayWeather: function (data) {
    //console.log(data);
    const { name } = data;
    //console.log(name);
    const { icon, description } = data.weather[0];
    const { temp, humidity } = data.main;
    const { speed } = data.wind;
    const { sunrise, sunset } = data.sys;
    let date1 = new Date(sunrise * 1000);
    let date2 = new Date(sunset * 1000);
    //console.log(formatAMPM(date));
    const { lat, lon } = data.coord;
    const airIndex = AirQuality(lon, lat);

    document.getElementById("city").innerText = `${languages[userLang].weatherIn} ` + name;

    document.getElementById(
      "icon"
    ).src = `https://openweathermap.org/img/wn/${icon}.png`;

    document.getElementById("description").innerText = description;

    document.getElementById("temp").innerText = temp + "°C";

    document.getElementById("humidity").innerText = `${languages[userLang].humidity}: ${humidity}%`;

    document.getElementById("wind").innerText = `${languages[userLang].windSpeed}: ${speed}km/h`;

    document.getElementById("weather").classList.remove("loading");

    document.getElementById("sunrise").innerText = `${languages[userLang].sunrise}: ${formatAMPM(
      date1
    )}`;

    document.getElementById("sunset").innerText = `${languages[userLang].sunrise}: ${formatAMPM(
      date2
    )}`;

    let url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&appid=${this.apiKey}`;
    getWeatherWeekly(url);
  },
  search: function () {
    if (document.querySelector(".search-bar").value != "") {
      this.fetchWeather(document.querySelector(".search-bar").value);
    } else {
      toastFunction(languages[userLang].pleaseAddLocation);
    }
  },
};

async function getWeatherWeekly(url) {
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      showWeatherData(data);
    });
}

function generateWeatherItem(
  dayString,
  iconName,
  nightTemperature,
  dayTemperature
) {
  let container = document.createElement("div");
  container.className = "weather-forecast-item rounded text-center";

  let day = document.createElement("div");
  day.innerText = dayString;
  day.style.color = "#00dcff";
  day.style.fontFamily = "cursive";
  day.style.fontWeight = "bolder";
  day.style.textTransform = "uppercase";
  day.style.fontSize = "20px";

  let icon = document.createElement("img");
  icon.src = `https://openweathermap.org/img/wn/${iconName}.png`;

  let dayTemp = document.createElement("div");
  dayTemp.classList.add("weather-forecast-day");
  dayTemp.innerHTML = "DAY \t" + `${dayTemperature}&#176;C`;
  dayTemp.style.fontFamily = "cursive";
  dayTemp.style.fontWeight = "bolder";
  dayTemp.style.textTransform = "uppercase";

  let nightTemp = document.createElement("div");
  nightTemp.innerHTML = "NIGHT \t" + `${nightTemperature}&#176;C`;
  nightTemp.style.color = "#00dcff";
  nightTemp.style.fontFamily = "cursive";
  nightTemp.style.fontWeight = "bolder";
  nightTemp.style.textTransform = "uppercase";

  container.appendChild(day);
  container.appendChild(icon);
  container.appendChild(dayTemp);
  container.appendChild(nightTemp);
  return container;
}

function showWeatherData(data) {
  let container = document.getElementById("weather-forecast");
  container.innerHTML = "";
  data.daily.forEach((day, idx) => {
    let dayString = window.moment(day.dt * 1000).format("dddd");
    let dateString = window.moment(day.dt * 1000).format("Do");
    let element = generateWeatherItem(
      languages[userLang][dayString.toLowerCase()],
      day.weather[0].icon,
      day.temp.night,
      day.temp.day
    );
    showCurrDay(dayString, parseInt(dateString), element);
    container.appendChild(element);
  });
}
//toast function
function toastFunction(val) {
  var x = document.getElementById("toast");
  x.className = "show";
  //change inner text
  document.getElementById("toast").innerText = val;
  setTimeout(function () {
    x.className = x.className.replace("show", "");
  }, 3000);
}
document.querySelector(".search button").addEventListener("click", function () {
  weather.search();
});

document
  .querySelector(".search-bar")
  .addEventListener("keyup", function (event) {
    if (event.key == "Enter") {
      weather.search();
    }
  });

// get user city name via ip api

fetch("https://ipapi.co/json/")
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
    // get the user's city
    let city = data.city;

    // set the user's location
    weather.fetchWeather(city);
  });

// SHOWS CURRENT DAY IN THE RENDERED DAYS
function showCurrDay(dayString, dateString, element) {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const date = new Date();
  const dayName = days[date.getDay()];
  const dayNumber = date.getDate();
  if (dayString == dayName && dateString == dayNumber) {
    element.style.backgroundColor = "#fff";
    element.querySelector(".weather-forecast-day").style.color =
      "rgba(0, 0, 0, 0.8)";
  }
}



document.getElementsByName("search-bar")[0].placeholder = languages[userLang].search

