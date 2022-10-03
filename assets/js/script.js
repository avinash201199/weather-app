import Capitals from "./Capitals.js";
const AIR_KEY = "427f7ef80457a39a26407e17ef0d604339190901";
function formatAMPM(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? "0" + minutes : minutes;
  var strTime = `${hours}:${minutes} ${ampm}`;
  return strTime;
}

const AirQuality = (log, lat) => {
  fetch(`https://api.waqi.info/feed/geo:${lat};${log}/?token=${AIR_KEY}`)
    .then((res) => res.json())
    .then((res) => {
      let aqi = res.data.aqi;
      document.querySelector(
        "#AirQuality"
      ).innerText = `Air Quality:${aqi}`;
      if (aqi >= 0 && aqi <= 50) {
        document.querySelector(".ml-0").innerText = "(Good)";
      }
      if (aqi > 50 && aqi <= 100) {
        document.querySelector(".ml-0").innerText =
          "(Satisfactory)";
      }
      if (aqi > 100 && aqi <= 150) {
        document.querySelector(".ml-0").innerText =
          "(Sensitive)";
      }
      if (aqi > 150 && aqi <= 200) {
        document.querySelector(".ml-0").innerText =
          "(Unhealthy)";
      }
      if (aqi > 200 && aqi <= 300) {
        document.querySelector(".ml-0").innerText =
          "(Very Unhealthy)";
      }
      if (aqi > 300) {
        document.querySelector(".ml-0").innerText =
          "(Hazardous)";
      }
    });
};

let weather = {
  apiKey: "20a36f8e1152244bbbd9ac296d3640f2",
  fetchWeather: function (city) {
    let isCountry=false;
    let index;
    for(let i=0;i<Capitals.length;i++){
      if(Capitals[i].country.toUpperCase()==city.toUpperCase()){
        isCountry=true;
        index=i;
        break;
      }
    }
    if(isCountry){
      city=Capitals[index].city;
    }
    fetch(
      "https://api.openweathermap.org/data/2.5/weather?q=" +
        city +
        "&units=metric&appid=" +
        this.apiKey
    )
      .then((response) => {
        if (!response.ok) {
          alert("No weather found.");
          throw new Error("No weather found.");
        }
        return response.json();
      })
      .then((data) => this.displayWeather(data));
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

    document.getElementById("city").innerText = "Weather in " + name;

    document.getElementById(
      "icon"
    ).src = `https://openweathermap.org/img/wn/${icon}.png`;

    document.getElementById("description").innerText = description;

    document.getElementById("temp").innerText = temp + "°C";

    document.getElementById("humidity").innerText = `Humidity: ${humidity}%`;

    document.getElementById("wind").innerText = `Wind speed: ${speed}km/h`;

    document.getElementById("weather").classList.remove("loading");

    document.getElementById("sunrise").innerText = `Sunrise: ${formatAMPM(
      date1
    )}`;

    document.getElementById("sunset").innerText = `Sunset: ${formatAMPM(
      date2
    )}`;

    let url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&appid=${this.apiKey}`;
    getWeatherWeekly(url);
  },
  search: function () {
    if (document.querySelector(".search-bar").value != "") {
      this.fetchWeather(document.querySelector(".search-bar").value);
    } else {
      window.alert("Please add a location");
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

  let icon = document.createElement("img");
  icon.src = `http://openweathermap.org/img/wn/${iconName}.png`;

  let nightTemp = document.createElement("div");
  nightTemp.innerHTML = `${nightTemperature}&#176;C`;

  let dayTemp = document.createElement("div");
  dayTemp.innerHTML = `${dayTemperature}&#176;C`;

  container.appendChild(day);
  container.appendChild(icon);
  container.appendChild(nightTemp);
  container.appendChild(dayTemp);
  return container;
}

function showWeatherData(data) {
  let container = document.getElementById("weather-forecast");
  container.innerHTML = "";
  data.daily.forEach((day, idx) => {
    let dayString = window.moment(day.dt * 1000).format("dddd");
    let element = generateWeatherItem(
      dayString,
      day.weather[0].icon,
      day.temp.night,
      day.temp.day
    );
    container.appendChild(element);
  });
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

weather.fetchWeather("Delhi");




