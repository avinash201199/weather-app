function formatAMPM(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? "0" + minutes : minutes;
  var strTime = hours + ":" + minutes + " " + ampm;
  return strTime;
}
var lat;
var lon;
let weather = {
  apiKey: "20a36f8e1152244bbbd9ac296d3640f2",
  fetchWeather: function (city, lat, lon) {
    let url;
    if (city != "") {
      url =
        "https://api.openweathermap.org/data/2.5/weather?q=" +
        city +
        "&units=metric&appid=" +
        this.apiKey;
    } else if (lat) {
      url =
        "https://api.openweathermap.org/data/2.5/weather?lat=" +
        lat +
        "&lon=" +
        lon +
        "&units=metric&appid=" +
        this.apiKey;
    }
    fetch(url)
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
    const { name } = data;
    const { icon, description } = data.weather[0];
    const { temp, humidity } = data.main;
    const { speed } = data.wind;
    const { sunrise, sunset } = data.sys;
    let date1 = new Date(sunrise * 1000);
    let date2 = new Date(sunset * 1000);
    //console.log(formatAMPM(date));
    const { lat, lon } = data.coord;
    document.querySelector(".city").innerText = "Weather in " + name;
    document.querySelector(".icon").src =
      "https://openweathermap.org/img/wn/" + icon + ".png";
    document.querySelector(".description").innerText = description;
    document.querySelector(".temp").innerText = temp + "°C";
    document.querySelector(".humidity").innerText =
      "Humidity: " + humidity + "%";
    document.querySelector(".wind").innerText =
      "Wind speed: " + speed + " km/h";
    document.querySelector(".weather").classList.remove("loading");
    document.body.style.backgroundImage =
      "url('https://source.unsplash.com/1600x900/?" + name + "')";
    document.querySelector(".sun .sunrise").innerText =
      "Sunrise:" + formatAMPM(date1);
    document.querySelector(".sun .sunset").innerText =
      "Sunset:" + formatAMPM(date2);
    url =
      "https://api.openweathermap.org/data/2.5/onecall?lat=" +
      lat +
      "&lon=" +
      lon +
      "&units=metric&appid=" +
      this.apiKey;
    getWeatherWeekly(url);
  },
  search: function () {
    if (document.querySelector(".search-bar").value != "") {
      this.fetchWeather(document.querySelector(".search-bar").value);
    } else {
      window.alert("Please Add a location");
    }
  },
};

async function getWeatherWeekly(url) {
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      showWeatherData(data);
    });
}

function showWeatherData(data) {
  const time = new Date();
  const day = time.getDay();
  var currentDate = moment();
  var weekStart = currentDate;
  let otherDayForcast = "";
  data.daily.forEach((day, idx) => {
    otherDayForcast += `
            <div class="weather-forecast-item">
                <div class="day">${window
                  .moment(weekStart)
                  .add(idx, "days")
                  .format("MMMM Do,dddd")}</div>
                <img src="http://openweathermap.org/img/wn/${
                  day.weather[0].icon
                }.png" alt="weather icon" class="w-icon">
                <div class="temp">Night - ${day.temp.night}&#176;C</div>
                <div class="temp">Day - ${day.temp.day}&#176;C</div>
            </div>
            
            `;
  });
  document.getElementById("weather-forecast").innerHTML = otherDayForcast;
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
let opt = {
  enableHighAccuracy: true,
  maximumAge: 0,
  timeout: 5000,
};
if (window.navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(pos, error, opt);
}
function error(err) {
  if (err.code === err.PERMISSION_DENIED) {
    console.log("Location perms denied.");
    weather.fetchWeather("delhi");
  }
}

function pos(p) {
  lon = p.coords.longitude;
  lat = p.coords.latitude;
  weather.fetchWeather("", lat, lon);
}
