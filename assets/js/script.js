import Capitals from "./Capitals.js";
import CITY from "./City.js";
import { translations, getUserLanguage } from "../../lang/translation.js";
import config from "./../../config/config.js";

// Weather Alerts System
class WeatherAlerts {
  constructor() {
    this.alertsContainer = document.getElementById('weather-alerts');
    this.safetyModal = document.getElementById('safety-modal-overlay');
    this.safetyModalContent = document.getElementById('safety-modal-content');
    this.closeModalBtn = document.getElementById('close-safety-modal');
    
    this.setupEventListeners();
  }

  setupEventListeners() {
    this.closeModalBtn.addEventListener('click', () => this.closeSafetyModal());
    this.safetyModal.addEventListener('click', (e) => {
      if (e.target === this.safetyModal) this.closeSafetyModal();
    });
  }

  checkWeatherConditions(weatherData) {
    const alerts = [];
    const { main, wind } = weatherData;
    const temp = isCelcius ? main.temp : (main.temp * 9/5) + 32;
    const humidity = main.humidity;
    const windSpeed = wind.speed;
    
    // Get current air quality from the existing system
    const airQualityElement = document.querySelector("#AirQuality");
    const aqi = airQualityElement ? parseInt(airQualityElement.innerText) : null;

    // Temperature alerts
    if (isCelcius) {
      if (temp > 40) {
        alerts.push({
          type: 'critical',
          icon: '🔥',
          title: 'Extreme Heat Warning',
          message: `Temperature: ${temp.toFixed(1)}°C - Stay indoors and hydrate frequently`,
          value: temp.toFixed(1) + '°C'
        });
      } else if (temp > 35) {
        alerts.push({
          type: 'warning',
          icon: '🌡️',
          title: 'High Temperature Alert',
          message: `Temperature: ${temp.toFixed(1)}°C - Limit outdoor activities`,
          value: temp.toFixed(1) + '°C'
        });
      } else if (temp < -10) {
        alerts.push({
          type: 'critical',
          icon: '🥶',
          title: 'Extreme Cold Warning',
          message: `Temperature: ${temp.toFixed(1)}°C - Risk of frostbite`,
          value: temp.toFixed(1) + '°C'
        });
      }
    } else {
      if (temp > 104) {
        alerts.push({
          type: 'critical',
          icon: '🔥',
          title: 'Extreme Heat Warning',
          message: `Temperature: ${temp.toFixed(1)}°F - Stay indoors and hydrate frequently`,
          value: temp.toFixed(1) + '°F'
        });
      } else if (temp > 95) {
        alerts.push({
          type: 'warning',
          icon: '🌡️',
          title: 'High Temperature Alert',
          message: `Temperature: ${temp.toFixed(1)}°F - Limit outdoor activities`,
          value: temp.toFixed(1) + '°F'
        });
      } else if (temp < 14) {
        alerts.push({
          type: 'critical',
          icon: '🥶',
          title: 'Extreme Cold Warning',
          message: `Temperature: ${temp.toFixed(1)}°F - Risk of frostbite`,
          value: temp.toFixed(1) + '°F'
        });
      }
    }

    // Wind speed alerts
    if (windSpeed > 20) {
      alerts.push({
        type: 'critical',
        icon: '💨',
        title: 'High Wind Warning',
        message: `Wind Speed: ${windSpeed} km/h - Avoid outdoor activities`,
        value: windSpeed + ' km/h'
      });
    } else if (windSpeed > 15) {
      alerts.push({
        type: 'warning',
        icon: '🌬️',
        title: 'Moderate Wind Alert',
        message: `Wind Speed: ${windSpeed} km/h - Exercise caution outdoors`,
        value: windSpeed + ' km/h'
      });
    }

    // Air quality alerts
    if (aqi) {
      if (aqi > 200) {
        alerts.push({
          type: 'critical',
          icon: '🏭',
          title: 'Poor Air Quality',
          message: `AQI: ${aqi} - Stay indoors, avoid outdoor exercise`,
          value: aqi.toString()
        });
      } else if (aqi > 150) {
        alerts.push({
          type: 'warning',
          icon: '😷',
          title: 'Unhealthy Air Quality',
          message: `AQI: ${aqi} - Consider wearing a mask outdoors`,
          value: aqi.toString()
        });
      } else if (aqi > 100) {
        alerts.push({
          type: 'moderate',
          icon: '⚠️',
          title: 'Moderate Air Quality',
          message: `AQI: ${aqi} - Sensitive individuals should limit outdoor activities`,
          value: aqi.toString()
        });
      }
    }

    // Humidity alerts
    if (humidity > 80) {
      alerts.push({
        type: 'moderate',
        icon: '💧',
        title: 'High Humidity',
        message: `Humidity: ${humidity}% - May feel uncomfortable`,
        value: humidity + '%'
      });
    }

    this.displayAlerts(alerts);
  }

  displayAlerts(alerts) {
    this.alertsContainer.innerHTML = '';
    
    alerts.forEach((alert, index) => {
      const alertElement = document.createElement('div');
      alertElement.className = `weather-alert ${alert.type}`;
      alertElement.innerHTML = `
        <div class="alert-header">
          <span class="alert-icon">${alert.icon}</span>
          <span>${alert.title}</span>
        </div>
        <div class="alert-message">
          ${alert.message}
        </div>
      `;
      
      // Add click event to show safety tips
      alertElement.addEventListener('click', () => this.showSafetyTips(alert.type));
      
      // Animate appearance
      setTimeout(() => {
        this.alertsContainer.appendChild(alertElement);
      }, index * 200);
    });
  }

  showSafetyTips(alertType) {
    const tips = this.getSafetyTips(alertType);
    this.safetyModalContent.innerHTML = tips.map(tip => `
      <div class="safety-tip">
        <div class="safety-tip-title">${tip.title}</div>
        <div class="safety-tip-text">${tip.text}</div>
      </div>
    `).join('');
    
    this.safetyModal.style.display = 'flex';
  }

  getSafetyTips(alertType) {
    const tipsByType = {
      critical: [
        {
          title: "🏠 Stay Indoors",
          text: "Avoid prolonged outdoor exposure during extreme weather conditions."
        },
        {
          title: "💧 Stay Hydrated",
          text: "Drink plenty of water even if you don't feel thirsty."
        },
        {
          title: "👕 Appropriate Clothing",
          text: "Wear light-colored, loose-fitting clothes in heat or layer up in cold."
        },
        {
          title: "📱 Emergency Contacts",
          text: "Keep emergency numbers handy and inform someone of your whereabouts."
        }
      ],
      warning: [
        {
          title: "⏰ Limit Outdoor Time",
          text: "Reduce time spent outdoors, especially during peak hours."
        },
        {
          title: "🧴 Use Protection",
          text: "Apply sunscreen, wear protective clothing, or use appropriate gear."
        },
        {
          title: "🚗 Safe Travel",
          text: "Exercise extra caution when driving or walking outdoors."
        }
      ],
      moderate: [
        {
          title: "👂 Stay Informed",
          text: "Monitor weather conditions and be prepared for changes."
        },
        {
          title: "🩺 Health Awareness",
          text: "Pay attention to how you feel and take breaks as needed."
        },
        {
          title: "📋 Plan Ahead",
          text: "Adjust outdoor plans based on current conditions."
        }
      ]
    };

    return tipsByType[alertType] || tipsByType.moderate;
  }

  closeSafetyModal() {
    this.safetyModal.style.display = 'none';
  }
}

// Initialize weather alerts system
const weatherAlerts = new WeatherAlerts();

// focus the search input as the DOM loads
window.onload = function () {
  document.getElementsByName("search-bar")[0].focus();

  // fetch background
  fetchNewBackground();
  // render favorites on load
  renderFavorites();
  // initialize unit from storage
  const storedUnit = localStorage.getItem("weather_unit");
  if (storedUnit === "imperial") {
    isCelcius = false;
    const unitCheckbox = document.getElementById("unit");
    if (unitCheckbox) unitCheckbox.checked = true; // checked means Fahrenheit in this UI
  }

  const themeToggle = document.getElementById('theme-toggle');
  const currentTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', currentTheme);

  themeToggle.addEventListener('click', () => {
    let theme = document.documentElement.getAttribute('data-theme');
    if (theme === 'light') {
      theme = 'dark';
    } else {
      theme = 'light';
    }
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  });
};

function changeBackgroundImage() {
  fetchNewBackground();
}

const userLang = getUserLanguage() || "en-US";
const place = document.querySelector("#place");

for (let i in CITY) {
  let option = document.createElement("option");
  option.value = CITY[i];
  option.text = CITY[i];
  place.appendChild(option);
}

function formatAMPM(date) {
  return date.toLocaleString(translations[userLang].formattingLocale, {
    hour: '2-digit',
    minute: '2-digit'
  });
}

let isCelcius = true;
let selectedCity;
$(".checkbox").change(function () {
  isCelcius = !this.checked;
  // persist preference
  localStorage.setItem("weather_unit", isCelcius ? "metric" : "imperial");
  if (selectedCity) weather.fetchWeather(selectedCity);
});

// Favorites handling
const FAVORITES_KEY = "weather_favorites";

function getFavorites() {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveFavorites(list) {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(list.slice(0, 12)));
  } catch (e) {
    // ignore quota errors
  }
}

function isFavoriteCity(city) {
  if (!city) return false;
  return getFavorites().some((c) => c.toLowerCase() === city.toLowerCase());
}

function toggleFavorite(city) {
  if (!city) return;
  let list = getFavorites();
  if (isFavoriteCity(city)) {
    list = list.filter((c) => c.toLowerCase() !== city.toLowerCase());
    toastFunction(`${city} removed from favorites`);
  } else {
    list.unshift(city);
    // dedupe
    list = list.filter(
      (c, idx, arr) => arr.findIndex((x) => x.toLowerCase() === c.toLowerCase()) === idx
    );
    toastFunction(`${city} added to favorites`);
  }
  saveFavorites(list);
  renderFavorites();
  updateFavoriteStar(city);
}

function updateFavoriteStar(city) {
  const icon = document.getElementById("favorite-icon");
  if (!icon) return;
  const fav = isFavoriteCity(city || selectedCity);
  icon.classList.toggle("fa-regular", !fav);
  icon.classList.toggle("fa-solid", fav);
}

function renderFavorites() {
  const wrap = document.getElementById("favorites");
  if (!wrap) return;
  wrap.innerHTML = "";
  const favs = getFavorites();
  if (!favs.length) {
    wrap.style.display = "none";
    return;
  }
  wrap.style.display = "flex";
  favs.forEach((city) => {
    const pill = document.createElement("button");
    pill.className = "favorite-pill";
    pill.title = city;
    pill.textContent = city;
    pill.addEventListener("click", () => {
      selectedCity = city;
      weather.fetchWeather(city);
    });
    const close = document.createElement("span");
    close.className = "favorite-pill__remove";
    close.textContent = "✕";
    close.title = "Remove";
    close.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleFavorite(city);
    });
    pill.appendChild(close);
    wrap.appendChild(pill);
  });
}

const AirQuality = (city) => {
  fetchAirQuality(city)
    .then((aqi) => updateAirQuality(aqi))
    .catch((error) => console.error(error));
};

const fetchAirQuality = (city) => {
  const url = `https://api.waqi.info/v2/search/?token=${config.AIR_KEY}&keyword=${city}`;

  return fetch(url)
    .then((res) => {
      if (!res.ok) {
        throw new Error(`Failed to fetch air quality data for ${city}`);
      }
      return res.json();
    })
    .then((data) => {
      const relevantLocation = data.data[0];
      return relevantLocation.aqi;
    });
};

const updateAirQuality = (aqi) => {
  const airQualityElement = document.querySelector("#AirQuality");
  const aqiText = translations[userLang].airQuality;
  airQualityElement.innerText = `${aqi}`;

  const airQuality = getAirQualityDescription(aqi, userLang);
  const textClass = getAirQualityClass(aqi);
  const qualityDescriptionElement =
    document.querySelector(".air-quality-label");

  qualityDescriptionElement.innerText = airQuality;
  qualityDescriptionElement.classList = "air-quality-label ml-0 " + textClass;
};

const getAirQualityDescription = (aqi, userLang) => {
  switch (true) {
    case aqi >= 0 && aqi <= 50:
      return `${translations[userLang].good}`;
    case aqi > 50 && aqi <= 100:
      return `${translations[userLang].satisfactory}`;
    case aqi > 100 && aqi <= 150:
      return `${translations[userLang].sensitive}`;
    case aqi > 150 && aqi <= 200:
      return `${translations[userLang].unhealthy}`;
    case aqi > 200 && aqi <= 300:
      return `${translations[userLang].veryUnhealthy}`;
    case aqi > 300:
      return `${translations[userLang].hazardous}`;
    default:
      return `${translations[userLang].notAvailable}`;
  }
};

const getAirQualityClass = (aqi) => {
  switch (true) {
    case aqi >= 0 && aqi <= 50:
      return "good-quality";
    case aqi > 50 && aqi <= 100:
      return "satisfactory-quality";
    case aqi > 100 && aqi <= 150:
      return "sensitive-quality";
    case aqi > 150 && aqi <= 200:
      return "unhealthy-quality";
    case aqi > 200 && aqi <= 300:
      return "very-unhealthy-quality";
    case aqi > 300:
      return "hazardous-quality";
    default:
      return "not-available";
  }
};

let weather = {
  fetchWeather: function (city = null, lat = null, lon = null) {
    let url;

    // Case 1: If latitude & longitude are provided (auto-location)
    if (lat && lon) {
      url =
        "https://api.openweathermap.org/data/2.5/weather?lat=" +
        lat +
        "&lon=" +
        lon +
        "&units=metric&appid=" +
        config.API_KEY +
        `&lang=${translations[userLang].apiLang}`;
    } else {
      // Case 2: If user typed a city or country
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

      url =
        "https://api.openweathermap.org/data/2.5/weather?q=" +
        city +
        "&units=metric&appid=" +
        config.API_KEY +
        `&lang=${translations[userLang].apiLang}`;
    }

    // Fetch weather
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          toastFunction(`${translations[userLang].noWeatherFound}`);
          document.getElementById("city").innerHTML = "City not Found";
          document.getElementById("temp").style.display = "none";
          document.querySelector(".weather-component__data-wrapper").style.display =
            "none";
          throw new Error(`${translations[userLang].noWeatherFound}`);
        }
        return response.json();
      })
      .then((data) => {
        document.getElementById("temp").style.display = "block";
        document.querySelector(".weather-component__data-wrapper").style.display =
          "block";
        this.displayWeather(data, city);
      });
  },

  fetchWeatherByCoords: function (lat, lon) {
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${config.API_KEY}&lang=${translations[userLang].apiLang}`
    )
      .then((response) => {
        if (!response.ok) {
          toastFunction(`${translations[userLang].noWeatherFound}`);
          throw new Error(`${translations[userLang].noWeatherFound}`);
        }
        return response.json();
      })
      .then((data) => {
        document.getElementById("temp").style.display = "block";
        document.querySelector(".weather-component__data-wrapper").style.display = "block";
        this.displayWeather(data, data.name);
      })
      .catch(() => {});
  },

  displayWeather: function (data, city) {
    const { name } = data;
    const { icon, description } = data.weather[0];
    const { temp, humidity } = data.main;
  const { speed } = data.wind; // m/s from API when units=metric
    const { sunrise, sunset } = data.sys;
    let date1 = new Date(sunrise * 1000);
    let date2 = new Date(sunset * 1000);
    const { lat, lon } = data.coord;
    AirQuality(city);

  // keep global selection in sync
  selectedCity = name || city;

    document
      .getElementById("icon")
      .addEventListener("click", changeBackgroundImage);

    document.getElementById("dynamic").innerText =
      `${translations[userLang].weatherIn} ` + name;

    document.getElementById("city").innerText =
      `${translations[userLang].weatherIn} ` + name;

    document.getElementById(
      "icon"
    ).src = `https://openweathermap.org/img/wn/${icon}.png`;

    document.getElementById("description").innerText = description;

    let temperature = temp;

    if (!isCelcius) {
      temperature = temperature * (9 / 5) + 32;
      temperature = (Math.round(temperature * 100) / 100).toFixed(2);
      temperature = temperature + "°F";
    } else {
      temperature = temperature + "°C";
    }
    document.getElementById("temp").innerText = temperature;

    document.getElementById("humidity").innerText = `${humidity}%`;

    // Convert wind speed to desired units
    // OpenWeather returns m/s for metric; convert to km/h or mph
    let windText = "";
    const kmh = (speed || 0) * 3.6;
    if (!isCelcius) {
      const mph = kmh * 0.621371;
      windText = `${mph.toFixed(1)} mph`;
    } else {
      windText = `${kmh.toFixed(1)} km/h`;
    }
    document.getElementById("wind").innerText = windText;

    document.getElementById("weather").classList.remove("loading");

    document.getElementById("sunrise").innerText = `${formatAMPM(date1)}`;

    document.getElementById("sunset").innerText = `${formatAMPM(date2)}`;

    let url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&appid=${config.API_KEY}`;
    getWeatherWeekly(url);
    document
      .getElementById("whatsapp-button")
      .replaceWith(document.getElementById("whatsapp-button").cloneNode(true));
    document
      .getElementById("whatsapp-button")
      .addEventListener("click", function () {
        const message = `Weather in ${name} today
      Temperature: ${temperature},
      Humidity: ${humidity}%,
      Wind Speed: ${speed}km/hr,
      Sunrise: ${formatAMPM(date1)},
      Sunset: ${formatAMPM(date2)}.`;
        // console.log(message)

        // Create the WhatsApp share URL
        const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
          message
        )}`;
        // Open WhatsApp in a new tab to share the message
        window.open(whatsappUrl, "_blank");
      });

  // update favorite star state
  updateFavoriteStar(name || city);
  },
  search: function () {
    if (document.querySelector(".weather-component__search-bar").value != "") {
      selectedCity = document.querySelector(
        ".weather-component__search-bar"
      ).value;
      this.fetchWeather(selectedCity);
      const apiKey = "OOjKyciq4Sk0Kla7riLuR2j8C9FwThFzKIKIHrpq7c27KvrCul5rVxJj";
      const apiUrl = `https://api.pexels.com/v1/search?query=${selectedCity}&orientation=landscape`;

      fetch(apiUrl, {
        method: "GET",
        headers: {
          Authorization: apiKey,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          const randomIndex = Math.floor(Math.random() * 10);
          const url = data.photos[randomIndex].src.large2x;
          document.getElementById(
            "background"
          ).style.backgroundImage = `url(${url})`;
        })
        .catch((error) => {
          console.error(error);
        });
      //url = "";
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
  if (!isCelcius) {
    dayTemperature = dayTemperature * (9 / 5) + 35;
    dayTemperature = (Math.round(dayTemperature * 100) / 100).toFixed(2);
    dayTemp.innerHTML = `${translations[userLang].day} ${dayTemperature}&#176;F`;
  } else {
    dayTemp.innerHTML = `${translations[userLang].day} ${dayTemperature}&#176;C`;
  }
  dayTemp.style.fontFamily = "Inter";
  dayTemp.style.fontWeight = "bolder";
  dayTemp.style.textTransform = "uppercase";

  let nightTemp = document.createElement("div");
  if (!isCelcius) {
    nightTemperature = nightTemperature * (9 / 5) + 35;
    nightTemperature = (Math.round(nightTemperature * 100) / 100).toFixed(2);
    nightTemp.innerHTML = `${translations[userLang].night} ${nightTemperature}&#176;F`;
  } else {
    nightTemp.innerHTML = `${translations[userLang].night} ${nightTemperature}&#176;C`;
  }
  nightTemp.style.color = "#00dcff";
  nightTemp.style.fontFamily = "Inter";
  nightTemp.style.fontWeight = "bolder";
  nightTemp.style.textTransform = "uppercase";

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
document
  .querySelector(".weather-component__search button")
  .addEventListener("click", function () {
    weather.search();
  });

document
  .querySelector(".weather-component__search-bar")
  .addEventListener("keyup", function (event) {
    if (event.key == "Enter") {
      weather.search();
    }
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
    element.classList.add("forecast-component__item-current-day");
  }
}

// Geolocation button
const geoBtn = document.getElementById("geo-button");
if (geoBtn && navigator.geolocation) {
  geoBtn.addEventListener("click", () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        weather.fetchWeatherByCoords(latitude, longitude);
      },
      (err) => {
        toastFunction("Location permission denied");
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
    );
  });
}

// Favorite toggle button
const favBtn = document.getElementById("favorite-toggle");
if (favBtn) {
  favBtn.addEventListener("click", () => toggleFavorite(selectedCity));
}

// Script for Live Time using SetInterval
var a;
var time;
const weekday = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
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
  "December",
];
const formatLeadingZero=(value)=>{
    //to add leading zeros if value is less than 10
    return value.toString().padStart(2, '0');
}
setInterval(() => {
  a = new Date();
  time =
    weekday[a.getDay()] +
    "  " +
    a.getDate() +
    "  " +
    month[a.getMonth()] +
    " " +
    a.getFullYear() 
    ;
  document.getElementById("date-time").innerHTML = time;
}, 1000);

setInterval(() => {
  a = new Date();
  time =
    formatLeadingZero(a.getHours()) +
    ":" +
    formatLeadingZero(a.getMinutes()) +
    ":" +
    formatLeadingZero(a.getSeconds()) +
    '';
  document.getElementById("date-time2").innerHTML = time;
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

function initLocationAndWeather() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // On success, get the coordinates and fetch weather
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        weather.fetchWeather(null, lat, lon);
      },
      (error) => {
        
        console.error("Geolocation error:", error);
        let errorMessage;
        if (error.code === error.PERMISSION_DENIED) {
          errorMessage = `${translations[userLang].permissionDenied}`;
        } else {
          errorMessage = `${translations[userLang].locationError}`;
        }
        toastFunction(errorMessage);
        
        
        weather.fetchWeather("London");
      },
      {
        // Options to improve accuracy and performance
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  } else {
    // If browser doesn't support geolocation at all
    toastFunction(`${translations[userLang].notSupported}`);
    weather.fetchWeather("London");
  }
}


window.onload = function () {
  document.getElementsByName("search-bar")[0].focus();
  fetchNewBackground();
  initLocationAndWeather(); // This is the single, clean call for the location feature
};
scrollTop();

//Fetching Random Landscape Background Image From Unsplash
const fetchNewBackground = () => {
  let url = `https://source.unsplash.com/${
    window.innerWidth < 768 ? "720x1280" : "1600x900"
  }/?landscape`;
  const bgElement = document.getElementById("background");
  bgElement.style.backgroundImage = `url(${url})`;
};

// Check if the browser supports the SpeechRecognition API
if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  const microphoneButton = document.querySelector(
    ".weather-component__button-microphone"
  );
  const searchBar = document.querySelector(".weather-component__search-bar");

  // Add an event listener to the microphone button to start speech recognition
  microphoneButton.addEventListener("click", () => {
    recognition.start();
  });

  // Add an event listener for when speech recognition results are available
  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;

    // Set the value of the search bar to the recognized speech
    searchBar.value = transcript;

    // Optionally, you can submit the form to perform the search
    // searchBar.form.submit();
  };

  // Handle speech recognition errors
  recognition.onerror = (event) => {
    console.error("Speech recognition error:", event.error);
  };
} else {
  // Handle the case where the browser does not support speech recognition
  console.error("Speech recognition is not supported in this browser.");
}

let follower = document.getElementById("circle");
let timer = null;

window.addEventListener("mousemove", function (details) {
  let y = details.clientY;
  let x = details.clientX;
  if (timer) {
    clearTimeout(timer);
  }
  if (follower) {
    timer = setTimeout(function () {
      follower.style.top = `${y}px`;
      follower.style.left = `${x}px`;
    }, 50);
  }
});






