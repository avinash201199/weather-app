import Capitals from "./Capitals.js";
import CITY from "./City.js";
import {translations, getUserLanguage} from "../../lang/translation.js";
import config from "./../../config/config.js";

// focus the search input as the DOM loads
window.onload = function() {
  document.getElementsByName("search-bar")[0].focus();
}

const userLang = getUserLanguage() || "en-US";
const place = document.querySelector("#place");

for (var i in CITY) {
  var option = document.createElement("option");
  option.value = CITY[i];
  option.text = CITY[i];
  place.appendChild(option);
}

function formatAMPM(date) {
  return date.toLocaleString(translations[userLang].formattingLocale, {
    hour: "numeric",
    minute: "numeric",
  });
}

let isCelcius = true;
let selectedCity;
$(".checkbox").change( function() {
  isCelcius = !this.checked;
  weather.fetchWeather(selectedCity);
});


const AirQuality = (log, lat) => {
  fetch(`https://api.waqi.info/feed/geo:${lat};${log}/?token=${config.AIR_KEY}`)
    .then((res) => res.json())
    .then((res) => {
      let aqi = res.data.aqi;
      document.querySelector(
        "#AirQuality"
      ).innerText = `${translations[userLang].airQuality}: ${aqi}`;

      if (aqi >= 0 && aqi <= 50) {
        document.querySelector(
          ".ml-0"
        ).innerText = `(${translations[userLang].good})`;
      }
      if (aqi > 50 && aqi <= 100) {
        document.querySelector(
          ".ml-0"
        ).innerText = `(${translations[userLang].satisfactory})`;
      }
      if (aqi > 100 && aqi <= 150) {
        document.querySelector(
          ".ml-0"
        ).innerText = `(${translations[userLang].sensitive})`;
      }
      if (aqi > 150 && aqi <= 200) {
        document.querySelector(
          ".ml-0"
        ).innerText = `(${translations[userLang].unhealthy})`;
      }
      if (aqi > 200 && aqi <= 300) {
        document.querySelector(
          ".ml-0"
        ).innerText = `(${translations[userLang].veryUnhealthy})`;
      }
      if (aqi > 300) {
        document.querySelector(
          ".ml-0"
        ).innerText = `(${translations[userLang].hazardous})`;
      }
    });
};

let weather = {
  fetchWeather: function (city) {
    let isCountry = false;
    let index;
    for (let i = 0; i < Capitals.length; i++) {
      if (Capitals[i].country.toUpperCase() === city.toUpperCase()) {
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
        config.API_KEY +
        `&lang=${translations[userLang].apiLang}`
    )
      .then((response) => {
        if (!response.ok) {
          toastFunction(`${translations[userLang].noWeatherFound}`);
          throw new Error(`${translations[userLang].noWeatherFound}`);
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

    document.getElementById("city").innerText =
      `${translations[userLang].weatherIn} ` + name;

    document.getElementById(
      "icon"
    ).src = `https://openweathermap.org/img/wn/${icon}.png`;

    document.getElementById("description").innerText = description;

    let temperature = temp;

    if(!isCelcius){
      temperature = (temperature*(9/5))+32;
      temperature = (Math.round(temperature * 100) / 100).toFixed(2);
      document.getElementById("temp").innerText = temperature + "°F";
    }
    else{
      document.getElementById("temp").innerText = temperature + "°C";
    }

    document.getElementById(
      "humidity"
    ).innerText = `${translations[userLang].humidity}: ${humidity}%`;

    document.getElementById(
      "wind"
    ).innerText = `${translations[userLang].windSpeed}: ${speed}km/h`;

    document.getElementById("weather").classList.remove("loading");

    document.getElementById("sunrise").innerText = `${
      translations[userLang].sunrise
    }: ${formatAMPM(date1)}`;

    document.getElementById("sunset").innerText = `${
      translations[userLang].sunset
    }: ${formatAMPM(date2)}`;

    let url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&appid=${config.API_KEY}`;
    getWeatherWeekly(url);
  },
  search: function () {
    if (document.querySelector(".weather-component__search-bar").value != "") {
      selectedCity=document.querySelector(".weather-component__search-bar").value;
      this.fetchWeather(selectedCity);
    } else {
      toastFunction(translations[userLang].pleaseAddLocation);
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
  container.className = "forecast-component__item rounded text-center";

  let day = document.createElement("div");
  day.innerText = dayString;
  day.style.color = "#00dcff";
  day.style.fontFamily = "Inter";
  day.style.fontWeight = "bolder";
  day.style.textTransform = "uppercase";
  day.style.fontSize = "20px";

  let newDiv = document.createElement("div");
  newDiv.className = "image-wrapper";

  let icon = document.createElement("img");
  icon.src = `https://openweathermap.org/img/wn/${iconName}.png`;

  let dayTemp = document.createElement("div");
  dayTemp.classList.add("weather-forecast-day");
  if(!isCelcius){
    dayTemperature = (dayTemperature*(9/5))+35;
    dayTemperature = (Math.round(dayTemperature * 100) / 100).toFixed(2);
    dayTemp.innerHTML = `${translations[userLang].day} ${dayTemperature}&#176;F`;
  }
  else{
    dayTemp.innerHTML = `${translations[userLang].day} ${dayTemperature}&#176;C`;
  }
  dayTemp.style.fontFamily="Inter"
  dayTemp.style.fontWeight="bolder"
  dayTemp.style.textTransform="uppercase"

  let nightTemp = document.createElement("div");
  if(!isCelcius){
    nightTemperature = (nightTemperature*(9/5))+35;
    nightTemperature = (Math.round(nightTemperature * 100) / 100).toFixed(2);
    nightTemp.innerHTML = `${translations[userLang].night} ${nightTemperature}&#176;F`;
  }
  else{
    nightTemp.innerHTML = `${translations[userLang].night} ${nightTemperature}&#176;C`;
  }
  nightTemp.style.color="#00dcff"
  nightTemp.style.fontFamily="Inter"
  nightTemp.style.fontWeight="bolder"
  nightTemp.style.textTransform="uppercase"

  container.appendChild(day);
  container.appendChild(newDiv);
  newDiv.appendChild(icon);
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
      translations[userLang][dayString.toLowerCase()],
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
document.querySelector(".weather-component__search button").addEventListener("click", function () {
  weather.search();
});



document
  .querySelector(".weather-component__search-bar")
  .addEventListener("keyup", function (event) {
    if (event.key == "Enter") {
      weather.search();
    }
  });

// get user city name via ip api

fetch("https://ipapi.co/json/")
  .then((response) => response.json())
  .then((data) => {
    selectedCity = data.city;
    weather.fetchWeather(data.city);
  });

document.getElementsByName("search-bar")[0].placeholder =
  translations[userLang].search;

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
    element.classList.add("forecast-component__item-current-day")
  }
}

// Script for Live Time using SetInterval
var a;
var time;
const weekday = [
  'Sunday', 
  'Monday', 
  'Tuesday',
  'Wednesday', 
  'Thursday', 
  'Friday', 
  'Saturday'
];

const month = [
  "January",
  "February",
  "March",
  "April",
   "May",
   "June",
   "July",
   "August",
   "September",
   "October",
   "November",
   "December"
];
setInterval(() => {
    a = new Date();
    time = weekday[a.getDay()] + '  ' + a.getDate() + '  ' + month[a.getMonth()] + ' ' + a.getFullYear()   + ' ' +  '  "Clock: ' + a.getHours() + ':' + a.getMinutes() + ':' + a.getSeconds() + '"';
    document.getElementById('date-time').innerHTML = time;
}, 1000);


 
 // scrollTop functionality
 const scrollTop = function () {
  // create HTML button element
  const scrollBtn = document.createElement("button");
  scrollBtn.innerHTML = "&#8679";
  scrollBtn.setAttribute("id", "scroll-btn");
  document.body.appendChild(scrollBtn);
  // hide/show button based on scroll distance
  const scrollBtnDisplay = function () {
  window.scrollY > window.innerHeight
  ? scrollBtn.classList.add("show")
  : scrollBtn.classList.remove("show");
  };
  window.addEventListener("scroll", scrollBtnDisplay);
  // scroll to top when button clicked
  const scrollWindow = function () {
  if (window.scrollY != 0) {
  setTimeout(function () {
  window.scrollTo(0, window.scrollY - 50);
  window.scroll({top: 0, behavior: "smooth"})
  scrollWindow();
  }, 10);
  }
  };
  scrollBtn.addEventListener("click", scrollWindow);
};
scrollTop();
