import Capitals from "./Capitals.js";
import CITY from "./City.js";
import { translations, getUserLanguage } from "../../lang/translation.js";
import config from "./../../config/config.js";
import ThemeManager from "./themeManager.js";

// ===== Error handling helpers (top of script.js) =====
const errorEl = document.getElementById("error-message");

function setError(message) {
  if (!errorEl) return;
  if (!message) {
    errorEl.textContent = "";
    errorEl.hidden = true;
  } else {
    errorEl.textContent = message;
    errorEl.hidden = false;
  }
}

// Weather Alerts System
class WeatherAlerts {
  constructor() {
    this.alertsContainer = document.getElementById("weather-alerts");
    this.safetyModal = document.getElementById("safety-modal-overlay");
    this.safetyModalContent = document.getElementById("safety-modal-content");
    this.closeModalBtn = document.getElementById("close-safety-modal");

    this.setupEventListeners();
  }

  setupEventListeners() {
    this.closeModalBtn.addEventListener("click", () => this.closeSafetyModal());
    this.safetyModal.addEventListener("click", (e) => {
      if (e.target === this.safetyModal) this.closeSafetyModal();
    });
  }

  checkWeatherConditions(weatherData) {
    const alerts = [];
    const { main, wind } = weatherData;
    const temp = isCelcius ? main.temp : (main.temp * 9) / 5 + 32;
    const humidity = main.humidity;
    const windSpeed = wind.speed;

    // Get current air quality from the existing system
    const airQualityElement = document.querySelector("#AirQuality");
    const aqi = airQualityElement
      ? parseInt(airQualityElement.innerText)
      : null;

    // Temperature alerts
    if (isCelcius) {
      if (temp > 40) {
        alerts.push({
          type: "critical",
          icon: "🔥",
          title: "Extreme Heat Warning",
          message: `Temperature: ${temp.toFixed(
            1
          )}°C - Stay indoors and hydrate frequently`,
          value: temp.toFixed(1) + "°C",
        });
      } else if (temp > 35) {
        alerts.push({
          type: "warning",
          icon: "🌡️",
          title: "High Temperature Alert",
          message: `Temperature: ${temp.toFixed(
            1
          )}°C - Limit outdoor activities`,
          value: temp.toFixed(1) + "°C",
        });
      } else if (temp < -10) {
        alerts.push({
          type: "critical",
          icon: "🥶",
          title: "Extreme Cold Warning",
          message: `Temperature: ${temp.toFixed(1)}°C - Risk of frostbite`,
          value: temp.toFixed(1) + "°C",
        });
      }
    } else {
      if (temp > 104) {
        alerts.push({
          type: "critical",
          icon: "🔥",
          title: "Extreme Heat Warning",
          message: `Temperature: ${temp.toFixed(
            1
          )}°F - Stay indoors and hydrate frequently`,
          value: temp.toFixed(1) + "°F",
        });
      } else if (temp > 95) {
        alerts.push({
          type: "warning",
          icon: "🌡️",
          title: "High Temperature Alert",
          message: `Temperature: ${temp.toFixed(
            1
          )}°F - Limit outdoor activities`,
          value: temp.toFixed(1) + "°F",
        });
      } else if (temp < 14) {
        alerts.push({
          type: "critical",
          icon: "🥶",
          title: "Extreme Cold Warning",
          message: `Temperature: ${temp.toFixed(1)}°F - Risk of frostbite`,
          value: temp.toFixed(1) + "°F",
        });
      }
    }

    // Wind speed alerts
    if (windSpeed > 20) {
      alerts.push({
        type: "critical",
        icon: "💨",
        title: "High Wind Warning",
        message: `Wind Speed: ${windSpeed} km/h - Avoid outdoor activities`,
        value: windSpeed + " km/h",
      });
    } else if (windSpeed > 15) {
      alerts.push({
        type: "warning",
        icon: "🌬️",
        title: "Moderate Wind Alert",
        message: `Wind Speed: ${windSpeed} km/h - Exercise caution outdoors`,
        value: windSpeed + " km/h",
      });
    }

    // Air quality alerts
    if (aqi) {
      if (aqi > 200) {
        alerts.push({
          type: "critical",
          icon: "🏭",
          title: "Poor Air Quality",
          message: `AQI: ${aqi} - Stay indoors, avoid outdoor exercise`,
          value: aqi.toString(),
        });
      } else if (aqi > 150) {
        alerts.push({
          type: "warning",
          icon: "😷",
          title: "Unhealthy Air Quality",
          message: `AQI: ${aqi} - Consider wearing a mask outdoors`,
          value: aqi.toString(),
        });
      } else if (aqi > 100) {
        alerts.push({
          type: "moderate",
          icon: "⚠️",
          title: "Moderate Air Quality",
          message: `AQI: ${aqi} - Sensitive individuals should limit outdoor activities`,
          value: aqi.toString(),
        });
      }
    }

    // Humidity alerts
    if (humidity > 80) {
      alerts.push({
        type: "moderate",
        icon: "💧",
        title: "High Humidity",
        message: `Humidity: ${humidity}% - May feel uncomfortable`,
        value: humidity + "%",
      });
    }

    this.displayAlerts(alerts);
  }

  displayAlerts(alerts) {
    this.alertsContainer.innerHTML = "";

    alerts.forEach((alert, index) => {
      const alertElement = document.createElement("div");
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
      alertElement.addEventListener("click", () =>
        this.showSafetyTips(alert.type)
      );

      // Animate appearance
      setTimeout(() => {
        this.alertsContainer.appendChild(alertElement);
      }, index * 200);
    });
  }

  showSafetyTips(alertType) {
    const tips = this.getSafetyTips(alertType);
    this.safetyModalContent.innerHTML = tips
      .map(
        (tip) => `
      <div class="safety-tip">
        <div class="safety-tip-title">${tip.title}</div>
        <div class="safety-tip-text">${tip.text}</div>
      </div>
    `
      )
      .join("");

    this.safetyModal.style.display = "flex";
  }

  getSafetyTips(alertType) {
    const tipsByType = {
      critical: [
        {
          title: "🏠 Stay Indoors",
          text: "Avoid prolonged outdoor exposure during extreme weather conditions.",
        },
        {
          title: "💧 Stay Hydrated",
          text: "Drink plenty of water even if you don't feel thirsty.",
        },
        {
          title: "👕 Appropriate Clothing",
          text: "Wear light-colored, loose-fitting clothes in heat or layer up in cold.",
        },
        {
          title: "📱 Emergency Contacts",
          text: "Keep emergency numbers handy and inform someone of your whereabouts.",
        },
      ],
      warning: [
        {
          title: "⏰ Limit Outdoor Time",
          text: "Reduce time spent outdoors, especially during peak hours.",
        },
        {
          title: "🧴 Use Protection",
          text: "Apply sunscreen, wear protective clothing, or use appropriate gear.",
        },
        {
          title: "🚗 Safe Travel",
          text: "Exercise extra caution when driving or walking outdoors.",
        },
      ],
      moderate: [
        {
          title: "👂 Stay Informed",
          text: "Monitor weather conditions and be prepared for changes.",
        },
        {
          title: "🩺 Health Awareness",
          text: "Pay attention to how you feel and take breaks as needed.",
        },
        {
          title: "📋 Plan Ahead",
          text: "Adjust outdoor plans based on current conditions.",
        },
      ],
    };

    return tipsByType[alertType] || tipsByType.moderate;
  }

  closeSafetyModal() {
    this.safetyModal.style.display = "none";
  }
}

// Initialize weather alerts system
const weatherAlerts = new WeatherAlerts();

// Network Status Monitoring
class NetworkMonitor {
  constructor() {
    this.isOnline = navigator.onLine;
    this.setupEventListeners();
    this.createNetworkStatusIndicator();
  }

  setupEventListeners() {
    window.addEventListener("online", () => {
      this.isOnline = true;
      this.hideNetworkStatus();
      console.log("Network connection restored");
    });

    window.addEventListener("offline", () => {
      this.isOnline = false;
      this.showNetworkStatus();
      console.log("Network connection lost");
    });
  }

  createNetworkStatusIndicator() {
    const indicator = document.createElement("div");
    indicator.id = "network-status";
    indicator.className = "network-status";
    indicator.innerHTML = `
      <i class="fas fa-wifi"></i>
      <span>No internet connection</span>
    `;
    document.body.appendChild(indicator);
  }

  showNetworkStatus() {
    const indicator = document.getElementById("network-status");
    if (indicator) {
      indicator.classList.add("show");
    }
  }

  hideNetworkStatus() {
    const indicator = document.getElementById("network-status");
    if (indicator) {
      indicator.classList.remove("show");
    }
  }

  isConnected() {
    return this.isOnline;
  }
}

// Initialize network monitoring
const networkMonitor = new NetworkMonitor();

// focus the search input as the DOM loads
window.onload = function () {
  document.getElementsByName("search-bar")[0].focus();

  // fetch background
  fetchNewBackground();
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
    hour: "2-digit",
    minute: "2-digit",
  });
}

let isCelcius = true;
let selectedCity;

// External unit label element (outside the toggle)
const unitToggleLabel = document.querySelector(".unit-toggle-label");

function updateUnitLabel() {
  if (!unitToggleLabel) return;
  unitToggleLabel.textContent = isCelcius ? "°C" : "°F";
  unitToggleLabel.style.color = isCelcius
    ? getComputedStyle(document.documentElement).getPropertyValue(
        "--text-primary"
      )
    : getComputedStyle(document.documentElement).getPropertyValue(
        "--text-secondary"
      );
}

// initialize label to match initial state
updateUnitLabel();

$(".checkbox").change(function () {
  isCelcius = !this.checked;
  updateUnitLabel();
  if (
    typeof weather !== "undefined" &&
    typeof weather.fetchWeather === "function"
  ) {
    weather.fetchWeather(selectedCity);
  }
});

// Leaflet map integration (Esri World Imagery)
let _weatherMap = null;
let _weatherMapMarker = null;
function initLeafletMap() {
  if (_weatherMap) return;
  const el = document.getElementById("weather-map");
  if (!el || typeof L === "undefined") return;
  _weatherMap = L.map("weather-map", {
    zoomControl: true,
    attributionControl: false,
    scrollWheelZoom: true,
  });
  // Ensure the map renders immediately
  _weatherMap.setView([20, 0], 2);
  const primaryUrl =
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
  const fallbackUrl =
    "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
  const layer = L.tileLayer(primaryUrl, { maxZoom: 19 }).addTo(_weatherMap);
  layer.on("tileerror", () => {
    // If a tile fails, swap to fallback endpoint once
    if (!_weatherMap.__esriFallback) {
      _weatherMap.__esriFallback = true;
      L.tileLayer(fallbackUrl, { maxZoom: 19 }).addTo(_weatherMap);
    }
  });
  // Invalidate size after the current frame to fix hidden container sizing
  setTimeout(() => {
    try {
      _weatherMap.invalidateSize(false);
    } catch (e) {}
  }, 50);
}
function updateMapView(lat, lon, cityLabel) {
  try {
    initLeafletMap();
    if (!_weatherMap) return;
    const target = [lat, lon];
    if (!_weatherMapMarker) {
      _weatherMapMarker = L.marker(target).addTo(_weatherMap);
    } else {
      _weatherMapMarker.setLatLng(target);
    }
    const zoomLevel = 13;
    _weatherMap.flyTo(target, zoomLevel, { duration: 1.15 });
    const labelEl = document.getElementById("map-city-label");
    if (labelEl) labelEl.textContent = cityLabel || "";
  } catch (e) {
    console.error("Map update error:", e);
  }
}
const AirQuality = (city) => {
  fetchAirQuality(city)
    .then((aqi) => updateAirQuality(aqi))
    .catch((error) => handleAirQualityError(error, city));
};

const fetchAirQuality = (city) => {
  const url = `https://api.waqi.info/v2/search/?token=${config.AIR_KEY}&keyword=${city}`;

  // Add timeout for air quality API
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout

  return fetch(url, {
    signal: controller.signal,
    headers: {
      Accept: "application/json",
    },
  })
    .then((res) => {
      clearTimeout(timeoutId);

      if (!res.ok) {
        switch (res.status) {
          case 401:
            throw new Error("AQI_API_KEY_INVALID");
          case 404:
            throw new Error("AQI_LOCATION_NOT_FOUND");
          case 429:
            throw new Error("AQI_RATE_LIMIT");
          default:
            throw new Error("AQI_NETWORK_ERROR");
        }
      }
      return res.json();
    })
    .then((data) => {
      // Validate air quality data

      if (
        !data ||
        !data.data ||
        !Array.isArray(data.data) ||
        data.data.length === 0
      ) {
        throw new Error("AQI_NO_DATA");
      }

      const relevantLocation = data.data[0];
      relevantLocation.aqi = Number(relevantLocation.aqi);
      if (!relevantLocation || isNaN(relevantLocation.aqi)) {
        throw new Error("AQI_INVALID_DATA");
      }

      return relevantLocation.aqi;
    })
    .catch((error) => {
      clearTimeout(timeoutId);
      throw error;
    });
};

const handleAirQualityError = (error, city) => {
  const airQualityElement = document.querySelector("#AirQuality");
  const qualityDescriptionElement =
    document.querySelector(".air-quality-label");

  let fallbackMessage = translations[userLang].notAvailable || "N/A";

  // Update UI with fallback values
  if (airQualityElement) {
    airQualityElement.innerText = fallbackMessage;
  }
  if (qualityDescriptionElement) {
    qualityDescriptionElement.innerText =
      translations[userLang].notAvailable || "Not Available";
    qualityDescriptionElement.classList =
      "air-quality-label ml-0 not-available";
  }

  console.warn("Air Quality Error for", city, ":", error.message);
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
  fetchWeather: async function (city = null, lat = null, lon = null) {
    let url;
    const lang =
      (translations[userLang] && translations[userLang].apiLang) || "en";

    // Case 1: If latitude & longitude are provided (auto-location)
    if (lat && lon) {
      url =
        "https://api.openweathermap.org/data/2.5/weather?lat=" +
        lat +
        "&lon=" +
        lon +
        "&units=metric&appid=" +
        config.API_KEY +
        `&lang=${lang}`;
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
        `&lang=${lang}`;
    }

    // Show loading state
    this.showLoadingState();

    // Enhanced fetch with comprehensive error handling
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    // Store 'this' context for use in callbacks
    const self = this;

    fetch(url, {
      signal: controller.signal,
    })
      .then((response) => {
        clearTimeout(timeoutId);

        if (!response.ok) {
          // Handle different HTTP status codes
          switch (response.status) {
            case 401:
              throw new Error("API_KEY_INVALID");
            case 404:
              throw new Error("CITY_NOT_FOUND");
            case 429:
              throw new Error("RATE_LIMIT_EXCEEDED");
            case 500:
            case 502:
            case 503:
              throw new Error("SERVER_ERROR");
            default:
              throw new Error("NETWORK_ERROR");
          }
        }
        return response.json();
      })
      .then((data) => {
        // Validate response data
        if (!data || !data.main || !data.weather || !data.weather[0]) {
          throw new Error("INVALID_DATA");
        }

        self.hideLoadingState();
        document.getElementById("temp").style.display = "block";
        document.querySelector(
          ".weather-component__data-wrapper"
        ).style.display = "block";
        self.displayWeather(data, city);
      })
      .catch((error) => {
        clearTimeout(timeoutId);
        self.hideLoadingState();
        self.handleWeatherError(error, city);
      });
  },

  getWeatherIcon: function (iconCode) {
    const iconMap = {
      "01d": "fa-sun",
      "01n": "fa-moon",
      "02d": "fa-cloud-sun",
      "02n": "fa-cloud-moon",
      "03d": "fa-cloud",
      "03n": "fa-cloud",
      "04d": "fa-cloud",
      "04n": "fa-cloud",
      "09d": "fa-cloud-showers-heavy",
      "09n": "fa-cloud-showers-heavy",
      "10d": "fa-cloud-sun-rain",
      "10n": "fa-cloud-moon-rain",
      "11d": "fa-bolt",
      "11n": "fa-bolt",
      "13d": "fa-snowflake",
      "13n": "fa-snowflake",
      "50d": "fa-smog",
      "50n": "fa-smog",
    };
    return iconMap[iconCode] || "fa-question-circle";
  },

  getUVIndexDescription: function (uvi) {
    if (uvi <= 2) {
      return {
        text: "Low",
        tip: "No protection needed.",
        className: "uvi-low",
      };
    } else if (uvi <= 5) {
      return {
        text: "Moderate",
        tip: "Sunscreen recommended.",
        className: "uvi-moderate",
      };
    } else if (uvi <= 7) {
      return {
        text: "High",
        tip: "Wear a hat and sunglasses.",
        className: "uvi-high",
      };
    } else if (uvi <= 10) {
      return {
        text: "Very High",
        tip: "Seek shade during midday.",
        className: "uvi-very-high",
      };
    } else {
      return {
        text: "Extreme",
        tip: "Avoid being outside.",
        className: "uvi-extreme",
      };
    }
  },

  fetchUVIndex: async function (lat, lon) {
    try {
      const uvUrl = `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${config.API_KEY}`;
      const response = await fetch(uvUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch UV index.");
      }
      const uvData = await response.json();
      this.updateUVIndex(uvData.value);
    } catch (error) {
      console.error("Error fetching UV index:", error);
    }
  },
  updateUVIndex: function (uvi) {
    const uviValueElement = document.getElementById("uvi");
    const uviTextElement = document.getElementById("uvi-text");
    const uviGridItem = document.querySelector(".grid-item-uvi");

    if (uviValueElement && uviTextElement && uviGridItem) {
      const uviValue = Math.round(uvi);
      const { text, tip, className } = this.getUVIndexDescription(uviValue);

      uviValueElement.textContent = uviValue;
      uviTextElement.textContent = `${text} - ${tip}`;

      // Remove old classes and add the new one for styling
      uviGridItem.classList.remove(
        "uvi-low",
        "uvi-moderate",
        "uvi-high",
        "uvi-very-high",
        "uvi-extreme"
      );
      uviGridItem.classList.add(className);
    }
  },

  updateLastUpdated: function () {
    const now = new Date();
    const timeString = now.toLocaleTimeString(
      translations[userLang].formattingLocale,
      { hour: "2-digit", minute: "2-digit" }
    );
    const lastUpdatedElement = document.getElementById("last-updated");
    lastUpdatedElement.textContent = `Last updated at ${timeString}`;
  },

  displayWeather: function (data, city) {
    const { name } = data;
    const { icon, description } = data.weather[0];
    const { temp, humidity } = data.main;
    const { speed } = data.wind;
    const { sunrise, sunset } = data.sys;
    let date1 = new Date(sunrise * 1000);
    let date2 = new Date(sunset * 1000);
    const { lat, lon } = data.coord;

    // Call AirQuality but don't let it block the weather display
    try {
      AirQuality(city);
    } catch (aqError) {
      console.warn("Air Quality fetch failed:", aqError);
    }

    // Check weather conditions for alerts
    setTimeout(() => {
      weatherAlerts.checkWeatherConditions(data);
      if (voiceCommands) {
        voiceCommands.updateMoodRecommendations();
      }
    }, 1000); // Delay to ensure air quality data is loaded

    // Update background based on time of day
    const weatherCard = document.querySelector(".weather-component__card");
    const isNight = icon.includes("n");
    weatherCard.classList.toggle("night", isNight);
    weatherCard.classList.toggle("day", !isNight);

    document.getElementById("dynamic").innerText =
      `${translations[userLang].weatherIn} ` + name;

    document.getElementById("city").innerText = name;

    // Update interactive map view
    updateMapView(lat, lon, name);

    // Update weather icon
    const iconElement = document.getElementById("icon");
    iconElement.className = `fas ${this.getWeatherIcon(icon)} fa-3x`;
    iconElement.addEventListener("click", changeBackgroundImage);

    document.getElementById("description").innerText = description;

    // Add transition class to temperature
    const tempElement = document.getElementById("temp");
    tempElement.style.transition = "all 0.4s ease-in-out";
    let temperature = temp;

    if (!isCelcius) {
      temperature = temperature * (9 / 5) + 32;
      temperature = (Math.round(temperature * 100) / 100).toFixed(2);
      temperature = temperature + "°F";
    } else {
      temperature = temperature + "°C";
    }
    tempElement.innerText = temperature;

    document.getElementById("humidity").innerText = `${humidity}%`;

    document.getElementById("wind").innerText = `${speed}km/h`;

    document.getElementById("weather").classList.remove("loading");

    document.getElementById("sunrise").innerText = `${formatAMPM(date1)}`;

    document.getElementById("sunset").innerText = `${formatAMPM(date2)}`;

    this.updateLastUpdated();

    this.fetchUVIndex(lat, lon);
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
      
      // Trigger weather update event for the globe
      const weatherUpdateEvent = new CustomEvent('weatherUpdate', {
        detail: {
          city: name,
          temp: temp,
          lat: lat,
          lon: lon,
          description: description,
          humidity: humidity,
          wind: speed
        }
      });
      document.dispatchEvent(weatherUpdateEvent);
  },
  search: async function () {
    if (document.querySelector(".weather-component__search-bar").value != "") {
      selectedCity = document.querySelector(
        ".weather-component__search-bar"
      ).value;
      this.fetchWeather(selectedCity);
      // Enhanced background image fetch with error handling
      this.fetchCityBackground(selectedCity);
    } else {
      toastFunction(translations[userLang].pleaseAddLocation, "warning", 3000);
    }
  },

  showLoadingState: function () {
    const weatherElement = document.getElementById("weather");
    const cityElement = document.getElementById("city");
    const tempElement = document.getElementById("temp");

    if (weatherElement) weatherElement.classList.add("loading");
    if (cityElement)
      cityElement.innerHTML = `${
        translations[userLang].loading || "Loading weather data..."
      }`;
    if (tempElement) tempElement.style.display = "none";
  },

  hideLoadingState: function () {
    const weatherElement = document.getElementById("weather");

    if (weatherElement) weatherElement.classList.remove("loading");
  },

  handleWeatherError: function (error, city) {
    const cityElement = document.getElementById("city");
    const tempElement = document.getElementById("temp");
    const dataWrapper = document.querySelector(
      ".weather-component__data-wrapper"
    );

    // Hide weather data
    if (tempElement) tempElement.style.display = "none";
    if (dataWrapper) dataWrapper.style.display = "none";

    let errorMessage;
    let toastType = "error";

    switch (error.message) {
      case "API_KEY_INVALID":
        errorMessage =
          translations[userLang].apiKeyInvalid ||
          "Invalid API key. Please check configuration.";
        if (cityElement) cityElement.innerHTML = "Configuration Error";
        break;
      case "CITY_NOT_FOUND":
        errorMessage =
          translations[userLang].noWeatherFound ||
          "City not found. Please check spelling.";
        if (cityElement) cityElement.innerHTML = "City Not Found";
        break;
      case "RATE_LIMIT_EXCEEDED":
        errorMessage =
          translations[userLang].rateLimitExceeded ||
          "Too many requests. Please try again later.";
        if (cityElement) cityElement.innerHTML = "Rate Limit Exceeded";
        toastType = "warning";
        break;
      case "SERVER_ERROR":
        errorMessage =
          translations[userLang].serverError ||
          "Weather service temporarily unavailable. Please try again.";
        if (cityElement) cityElement.innerHTML = "Service Unavailable";
        break;
      case "INVALID_DATA":
        errorMessage =
          translations[userLang].invalidData ||
          "Received invalid weather data. Please try again.";
        if (cityElement) cityElement.innerHTML = "Data Error";
        break;
      default:
        if (error.name === "AbortError") {
          errorMessage =
            translations[userLang].requestTimeout ||
            "Request timed out. Please check your connection.";
          if (cityElement) cityElement.innerHTML = "Connection Timeout";
        } else {
          errorMessage =
            translations[userLang].networkError ||
            "Network error. Please check your connection.";
          if (cityElement) cityElement.innerHTML = "Network Error";
        }
    }

    toastFunction(errorMessage, toastType, 6000);
  },

  fetchCityBackground: function (city) {
    const apiKey = "OOjKyciq4Sk0Kla7riLuR2j8C9FwThFzKIKIHrpq7c27KvrCul5rVxJj";
    const apiUrl = `https://api.pexels.com/v1/search?query=${encodeURIComponent(
      city
    )}&orientation=landscape&per_page=15`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    fetch(apiUrl, {
      method: "GET",
      signal: controller.signal,
      headers: {
        Authorization: apiKey,
        Accept: "application/json",
      },
    })
      .then((response) => {
        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`Pexels API error: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (data && data.photos && data.photos.length > 0) {
          const randomIndex = Math.floor(
            Math.random() * Math.min(data.photos.length, 10)
          );
          const imageUrl = data.photos[randomIndex].src.large2x;

          // Preload image before setting as background
          const img = new Image();
          img.onload = () => {
            document.getElementById(
              "background"
            ).style.backgroundImage = `url(${imageUrl})`;
          };
          img.onerror = () => {
            this.setFallbackBackground();
          };
          img.src = imageUrl;
        } else {
          this.setFallbackBackground();
        }
      })
      .catch((error) => {
        clearTimeout(timeoutId);
        console.warn("Background image fetch failed:", error.message);
        this.setFallbackBackground();
      });
  },

  setFallbackBackground: function () {
    // Use Unsplash as fallback or default gradient
    const fallbackUrl = `https://source.unsplash.com/${
      window.innerWidth < 768 ? "720x1280" : "1600x900"
    }/?landscape`;

    const img = new Image();
    img.onload = () => {
      document.getElementById(
        "background"
      ).style.backgroundImage = `url(${fallbackUrl})`;
    };
    img.onerror = () => {
      // Final fallback to gradient
      document.getElementById("background").style.background =
        "linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)";
    };
    img.src = fallbackUrl;
  },
};

async function getWeatherWeekly(url) {
  try {
    const res = await fetch(url);
    const data = await res.json();
    showWeatherData(data);
  } catch (error) {
    console.error("Error fetching weekly weather:", error);
  }
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
    dayTemperature = dayTemperature * (9 / 5) + 32;
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
    nightTemperature = nightTemperature * (9 / 5) + 32;
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
// Enhanced Toast Notification System
function toastFunction(message, type = "info", duration = 4000) {
  const toast = document.getElementById("toast");
  const toastMessage = document.getElementById("toast-message");
  const toastClose = document.getElementById("toast-close");

  // Safety check for DOM elements — if missing, fallback to console
  if (!toast || !toastMessage || !toastClose) {
    console.error("Toast elements not found in DOM");
    console.log(`Toast ${type.toUpperCase()}: ${message}`);
    return;
  }

  // Clear any existing timeouts
  if (toast.hideTimeout) {
    clearTimeout(toast.hideTimeout);
    toast.hideTimeout = null;
  }

  // Populate message and type
  toastMessage.textContent = message;
  // ensure other type classes removed
  toast.classList.remove("error", "success", "warning", "info");
  toast.classList.add("show");
  if (type && typeof type === "string") toast.classList.add(type);

  // Accessibility: expose to assistive tech
  toast.setAttribute("aria-hidden", "false");
  toast.setAttribute("role", "status");
  toast.setAttribute("aria-live", "polite");

  // Keep track of previously focused element to restore later
  const previouslyFocused = document.activeElement;
  try {
    toast.setAttribute("tabindex", "-1");
    toast.focus({ preventScroll: true });
  } catch (e) {
    // ignore focus failures
  }

  // Auto-hide
  toast.hideTimeout = setTimeout(() => {
    hideToast();
  }, duration);

  // Remove any previous click handler then add new
  toastClose.onclick = null;
  toastClose.addEventListener(
    "click",
    function onCloseClick(e) {
      e.preventDefault();
      if (toast.hideTimeout) {
        clearTimeout(toast.hideTimeout);
        toast.hideTimeout = null;
      }
      hideToast();
    },
    { once: true }
  );

  function hideToast() {
    toast.classList.remove("show");
    toast.classList.add("hide");

    // After animation, reset state
    setTimeout(() => {
      toast.className = "toast";
      toast.setAttribute("aria-hidden", "true");
      try {
        toast.removeAttribute("tabindex");
      } catch (e) {}
      if (toast.hideTimeout) {
        clearTimeout(toast.hideTimeout);
        toast.hideTimeout = null;
      }
      // restore focus
      try {
        if (previouslyFocused && previouslyFocused.focus)
          previouslyFocused.focus();
      } catch (e) {}
    }, 300);
  }
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
const formatLeadingZero = (value) => {
  //to add leading zeros if value is less than 10
  return value.toString().padStart(2, "0");
};
setInterval(() => {
  a = new Date();
  time =
    weekday[a.getDay()] +
    "  " +
    a.getDate() +
    "  " +
    month[a.getMonth()] +
    " " +
    a.getFullYear();
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
    "";
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
  // attach listeners
  window.addEventListener("scroll", scrollBtnDisplay);
  scrollBtn.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
};

function initLocationAndWeather() {
  // Always show something immediately
  weather.fetchWeather("London");
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
        toastFunction(errorMessage, "error", 5000);

        // We already loaded fallback above; keep UI responsive
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
    toastFunction(`${translations[userLang].notSupported}`, "error", 5000);
    weather.fetchWeather("London");
  }
}

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

// ===========================
// UNIQUE WEATHER APP FEATURES
// ===========================

// 1. Enhanced Voice Commands with Natural Language Processing
class VoiceWeatherCommands {
  constructor() {
    this.recognition = null;
    this.isListening = false;
    this.setupVoiceRecognition();
    this.setupEventListeners();
  }

  setupVoiceRecognition() {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = "en-US";
    }
  }

  setupEventListeners() {
    const micBtn = document.getElementById("microphone-button");
    const voiceStatus = document.getElementById("voice-status");

    if (micBtn && this.recognition) {
      micBtn.addEventListener("click", () => this.toggleListening());

      this.recognition.onstart = () => {
        this.isListening = true;
        micBtn.classList.add("listening");
        voiceStatus.textContent =
          '🎤 Listening... Try "Weather in Paris" or "Will it rain tomorrow?"';
        voiceStatus.classList.add("show");
      };

      this.recognition.onend = () => {
        this.isListening = false;
        micBtn.classList.remove("listening");
        voiceStatus.classList.remove("show");
      };

      this.recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        this.processVoiceCommand(transcript);
      };

      this.recognition.onerror = (event) => {
        console.error("Voice recognition error:", event.error);
        voiceStatus.textContent =
          "❌ Voice recognition failed. Please try again.";
        setTimeout(() => voiceStatus.classList.remove("show"), 2000);
      };
    }
  }

  toggleListening() {
    if (this.isListening) {
      this.recognition.stop();
    } else {
      this.recognition.start();
    }
  }

  processVoiceCommand(transcript) {
    console.log("Voice command:", transcript);

    // Extract city names using pattern matching
    const cityPatterns = [
      /weather in ([a-zA-Z\s]+)/,
      /what's the weather in ([a-zA-Z\s]+)/,
      /how's the weather in ([a-zA-Z\s]+)/,
      /temperature in ([a-zA-Z\s]+)/,
      /forecast for ([a-zA-Z\s]+)/,
    ];

    for (const pattern of cityPatterns) {
      const match = transcript.match(pattern);
      if (match) {
        const city = match[1].trim();
        document.querySelector(".weather-component__search-bar").value = city;
        weather.fetchWeather(city);
        this.generateMoodRecommendations(city);
        toastFunction(`🎤 Searching weather for ${city}...`);
        return;
      }
    }

    // Handle general queries
    if (
      transcript.includes("rain") ||
      transcript.includes("sunny") ||
      transcript.includes("cloudy")
    ) {
      toastFunction("🎤 Please specify a city for weather information!");
    } else {
      toastFunction('🎤 Try asking "What\'s the weather in [city name]?"');
    }
  }

  generateMoodRecommendations(city) {
    // This will be called after weather data is fetched
    setTimeout(() => this.updateMoodRecommendations(), 1000);
  }

  updateMoodRecommendations() {
    const weatherDesc =
      document.getElementById("description")?.textContent?.toLowerCase() || "";
    const temp =
      parseFloat(
        document
          .getElementById("temp")
          ?.textContent?.replace("°C", "")
          .replace("°F", "")
      ) || 0;

    const recommendations = this.generateSmartRecommendations(
      weatherDesc,
      temp
    );
    this.displayMoodRecommendations(recommendations);
  }

  generateSmartRecommendations(weather, temp) {
    const recommendations = [];

    if (weather.includes("sunny") || weather.includes("clear")) {
      recommendations.push({
        icon: "☀️",
        title: "Perfect Beach Day!",
        description:
          "Great weather for outdoor activities like hiking, picnics, or visiting the beach. Don't forget sunscreen!",
      });
      recommendations.push({
        icon: "🚴",
        title: "Bike Adventure",
        description:
          "Ideal conditions for cycling or jogging. The sunshine will boost your vitamin D and mood!",
      });
    } else if (weather.includes("rain")) {
      recommendations.push({
        icon: "☕",
        title: "Cozy Indoor Time",
        description:
          "Perfect weather for reading a book, watching movies, or trying that new recipe you've been saving.",
      });
      recommendations.push({
        icon: "🎨",
        title: "Creative Session",
        description:
          "Rainy days are great for indoor hobbies like painting, writing, or learning a new skill online.",
      });
    } else if (weather.includes("cloud")) {
      recommendations.push({
        icon: "📸",
        title: "Photography Walk",
        description:
          "Cloudy skies create beautiful, soft lighting for photography. Perfect for capturing cityscapes!",
      });
      recommendations.push({
        icon: "🛍️",
        title: "Shopping & Exploration",
        description:
          "Mild weather is great for exploring new neighborhoods, visiting museums, or shopping.",
      });
    }

    if (temp > 25) {
      recommendations.push({
        icon: "🍦",
        title: "Cool Treats",
        description:
          "Beat the heat with ice cream, smoothies, or a refreshing swim. Stay hydrated!",
      });
    } else if (temp < 10) {
      recommendations.push({
        icon: "🔥",
        title: "Warm & Cozy",
        description:
          "Time for hot chocolate, warm soups, and cozy blankets. Perfect for indoor gatherings!",
      });
    }

    return recommendations;
  }

  displayMoodRecommendations(recommendations) {
    const container = document.getElementById("mood-recommendations");
    if (!container) return;

    container.innerHTML = recommendations
      .map(
        (rec) => `
      <div class="mood-item">
        <span class="mood-icon">${rec.icon}</span>
        <div class="mood-title">${rec.title}</div>
        <div class="mood-description">${rec.description}</div>
      </div>
    `
      )
      .join("");
  }
}

// 2. Weather Time Machine
class WeatherTimeMachine {
  constructor() {
    this.setupEventListeners();
  }

  setupEventListeners() {
    const timeMachineBtn = document.getElementById("time-machine-btn");
    const yearSelector = document.getElementById("year-selector");

    if (timeMachineBtn) {
      timeMachineBtn.addEventListener("click", () => {
        const selectedYear = yearSelector.value;
        this.fetchHistoricalWeather(selectedYear);
      });
    }
  }

  async fetchHistoricalWeather(year) {
    const container = document.getElementById("historical-weather");
    if (!container) return;

    // Show loading
    container.innerHTML =
      '<div class="historical-placeholder">� Fetching historical weather data...</div>';

    try {
      // Get current city from the weather display
      const currentCity =
        document.getElementById("city")?.textContent || "London";

      // Generate realistic historical data based on current date and city
      const historicalData = this.generateRealisticHistoricalData(
        year,
        currentCity
      );
      this.displayHistoricalWeather(historicalData, year, currentCity);
    } catch (error) {
      container.innerHTML =
        '<div class="historical-placeholder">❌ Unable to retrieve historical weather data</div>';
    }
  }

  generateRealisticHistoricalData(year, city) {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentDay = currentDate.getDate();
    const historicalData = [];

    // Base temperatures by month for different regions (more realistic)
    const cityTempProfiles = {
      London: [7, 8, 11, 13, 17, 20, 22, 22, 19, 15, 10, 8],
      Paris: [6, 8, 12, 15, 19, 22, 25, 24, 21, 16, 10, 7],
      Tokyo: [6, 7, 10, 15, 19, 22, 26, 27, 23, 18, 13, 8],
      "New York": [3, 4, 9, 15, 20, 25, 28, 27, 23, 17, 11, 5],
      Sydney: [22, 22, 20, 17, 14, 11, 10, 12, 15, 18, 20, 21],
      Mumbai: [24, 25, 27, 30, 32, 29, 27, 27, 28, 29, 27, 25],
      Default: [10, 12, 15, 18, 22, 25, 27, 26, 23, 19, 14, 11],
    };

    const tempProfile = cityTempProfiles[city] || cityTempProfiles["Default"];
    const baseTemp = tempProfile[currentMonth];

    // Weather conditions based on season and region
    const getSeasonalWeather = (month, region = "temperate") => {
      const conditions = {
        winter: ["Clear", "Cloudy", "Overcast", "Light Rain", "Partly Cloudy"],
        spring: ["Partly Cloudy", "Clear", "Light Rain", "Cloudy", "Sunny"],
        summer: ["Sunny", "Clear", "Partly Cloudy", "Thunderstorms", "Hot"],
        autumn: ["Cloudy", "Partly Cloudy", "Light Rain", "Overcast", "Clear"],
      };

      let season;
      if (month >= 11 || month <= 1) season = "winter";
      else if (month >= 2 && month <= 4) season = "spring";
      else if (month >= 5 && month <= 7) season = "summer";
      else season = "autumn";

      return conditions[season];
    };

    const seasonalConditions = getSeasonalWeather(currentMonth);

    // Generate 7 days of historical data
    for (let i = 0; i < 7; i++) {
      const date = new Date(year, currentMonth, currentDay - i);
      const dayOfYear = Math.floor(
        (date - new Date(date.getFullYear(), 0, 0)) / 86400000
      );

      // Add some realistic variation based on the day of year and year
      const yearVariation = (parseInt(year) - 2020) * 0.5; // Climate change factor
      const seasonalVariation = Math.sin((dayOfYear / 365) * 2 * Math.PI) * 5;
      const randomVariation = (Math.random() - 0.5) * 8;

      const historicalTemp = Math.round(
        baseTemp + yearVariation + seasonalVariation + randomVariation
      );
      const currentTemp =
        document.getElementById("temp")?.textContent?.replace(/[°CF]/g, "") ||
        baseTemp;
      const tempDiff = historicalTemp - parseInt(currentTemp);

      const condition =
        seasonalConditions[
          Math.floor(Math.random() * seasonalConditions.length)
        ];

      historicalData.push({
        date: date.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        }),
        temp: historicalTemp,
        condition: condition,
        comparison:
          tempDiff > 2 ? "warmer" : tempDiff < -2 ? "cooler" : "similar",
        tempDiff: Math.abs(tempDiff),
        precipitation: Math.random() > 0.7 ? Math.round(Math.random() * 15) : 0,
      });
    }

    return historicalData;
  }

  displayHistoricalWeather(data, year, city) {
    const container = document.getElementById("historical-weather");

    container.innerHTML = `
      <div style="text-align: center; margin-bottom: 25px;">
        <h4 style="color: #4a90e2; margin-bottom: 10px;">
          📅 ${city} Weather History - ${year}
        </h4>
        <p style="color: rgba(255,255,255,0.8); font-size: 0.9rem;">
          Historical weather data for the same period in ${year}
        </p>
      </div>
      <div style="display: grid; gap: 12px;">
        ${data
          .map(
            (day, index) => `
          <div class="historical-item" style="
            background: ${
              index === 0
                ? "rgba(74, 144, 226, 0.15)"
                : "rgba(255, 255, 255, 0.05)"
            };
            border-left-color: ${
              day.comparison === "warmer"
                ? "#ff6b6b"
                : day.comparison === "cooler"
                ? "#4ecdc4"
                : "#ffa500"
            };
          ">
            <div style="flex: 1;">
              <div style="font-weight: bold; color: #fff;">${day.date}</div>
              <div style="color: #ffeb3b; font-size: 0.9rem;">${
                day.condition
              }</div>
              ${
                day.precipitation > 0
                  ? `<div style="color: #64b5f6; font-size: 0.8rem;">💧 ${day.precipitation}mm</div>`
                  : ""
              }
            </div>
            <div style="text-align: right;">
              <div style="font-size: 1.2rem; font-weight: bold; color: #fff;">
                ${day.temp}°C
              </div>
              <div style="font-size: 0.8rem; opacity: 0.8; color: ${
                day.comparison === "warmer"
                  ? "#ff6b6b"
                  : day.comparison === "cooler"
                  ? "#4ecdc4"
                  : "#ffa500"
              };">
                ${day.tempDiff}° ${day.comparison}
              </div>
            </div>
          </div>
        `
          )
          .join("")}
      </div>
      <div style="text-align: center; margin-top: 20px; padding: 15px; background: rgba(255,255,255,0.05); border-radius: 10px;">
        <small style="color: rgba(255,255,255,0.7);">
          💡 Data shows general weather patterns. Actual historical conditions may vary.
        </small>
      </div>
    `;
  }
}

// 3. Interactive 3D Weather Globe
class WeatherGlobe {
  constructor() {
    this.currentRegion = "americas";
    this.weatherData = this.generateGlobalWeatherData();
    this.setupEventListeners();
    this.initializeGlobe();
  }

  setupEventListeners() {
    const globeBtns = document.querySelectorAll(".globe-btn");
    globeBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const region = e.target.dataset.region;
        this.focusRegion(region);

        // Update active button
        globeBtns.forEach((b) => b.classList.remove("active"));
        e.target.classList.add("active");
      });
    });
  }

  generateGlobalWeatherData() {
    // Real major cities with accurate geographical distribution
    const regions = {
      americas: [
        {
          name: "New York",
          lat: 40.7128,
          lng: -74.006,
          weather: "cloudy",
          temp: 18,
          country: "USA",
        },
        {
          name: "Los Angeles",
          lat: 34.0522,
          lng: -118.2437,
          weather: "sunny",
          temp: 26,
          country: "USA",
        },
        {
          name: "Mexico City",
          lat: 19.4326,
          lng: -99.1332,
          weather: "partly cloudy",
          temp: 20,
          country: "Mexico",
        },
        {
          name: "São Paulo",
          lat: -23.5505,
          lng: -46.6333,
          weather: "rainy",
          temp: 22,
          country: "Brazil",
        },
        {
          name: "Toronto",
          lat: 43.6532,
          lng: -79.3832,
          weather: "cloudy",
          temp: 15,
          country: "Canada",
        },
        {
          name: "Buenos Aires",
          lat: -34.6118,
          lng: -58.396,
          weather: "sunny",
          temp: 19,
          country: "Argentina",
        },
      ],
      europe: [
        {
          name: "London",
          lat: 51.5074,
          lng: -0.1278,
          weather: "rainy",
          temp: 15,
          country: "UK",
        },
        {
          name: "Paris",
          lat: 48.8566,
          lng: 2.3522,
          weather: "cloudy",
          temp: 17,
          country: "France",
        },
        {
          name: "Rome",
          lat: 41.9028,
          lng: 12.4964,
          weather: "sunny",
          temp: 24,
          country: "Italy",
        },
        {
          name: "Berlin",
          lat: 52.52,
          lng: 13.405,
          weather: "cloudy",
          temp: 16,
          country: "Germany",
        },
        {
          name: "Madrid",
          lat: 40.4168,
          lng: -3.7038,
          weather: "sunny",
          temp: 23,
          country: "Spain",
        },
        {
          name: "Amsterdam",
          lat: 52.3676,
          lng: 4.9041,
          weather: "rainy",
          temp: 14,
          country: "Netherlands",
        },
      ],
      asia: [
        {
          name: "Tokyo",
          lat: 35.6762,
          lng: 139.6503,
          weather: "cloudy",
          temp: 21,
          country: "Japan",
        },
        {
          name: "Beijing",
          lat: 39.9042,
          lng: 116.4074,
          weather: "partly cloudy",
          temp: 19,
          country: "China",
        },
        {
          name: "Mumbai",
          lat: 19.076,
          lng: 72.8777,
          weather: "humid",
          temp: 31,
          country: "India",
        },
        {
          name: "Seoul",
          lat: 37.5665,
          lng: 126.978,
          weather: "cloudy",
          temp: 18,
          country: "South Korea",
        },
        {
          name: "Bangkok",
          lat: 13.7563,
          lng: 100.5018,
          weather: "thunderstorm",
          temp: 32,
          country: "Thailand",
        },
        {
          name: "Dubai",
          lat: 25.2048,
          lng: 55.2708,
          weather: "sunny",
          temp: 35,
          country: "UAE",
        },
      ],
      africa: [
        {
          name: "Cairo",
          lat: 30.0444,
          lng: 31.2357,
          weather: "sunny",
          temp: 32,
          country: "Egypt",
        },
        {
          name: "Cape Town",
          lat: -33.9249,
          lng: 18.4241,
          weather: "windy",
          temp: 19,
          country: "South Africa",
        },
        {
          name: "Lagos",
          lat: 6.5244,
          lng: 3.3792,
          weather: "thunderstorm",
          temp: 29,
          country: "Nigeria",
        },
        {
          name: "Nairobi",
          lat: -1.2921,
          lng: 36.8219,
          weather: "partly cloudy",
          temp: 23,
          country: "Kenya",
        },
        {
          name: "Marrakech",
          lat: 31.6295,
          lng: -7.9811,
          weather: "sunny",
          temp: 28,
          country: "Morocco",
        },
        {
          name: "Johannesburg",
          lat: -26.2041,
          lng: 28.0473,
          weather: "clear",
          temp: 21,
          country: "South Africa",
        },
      ],
    };

    return regions;
  }

  initializeGlobe() {
    this.focusRegion("americas");
    document
      .querySelector('.globe-btn[data-region="americas"]')
      ?.classList.add("active");
  }

  focusRegion(region) {
    this.currentRegion = region;
    const markersContainer = document.getElementById("globe-markers");
    if (!markersContainer) return;

    // Clear existing markers
    markersContainer.innerHTML = "";

    // Add markers for the selected region with realistic positioning
    const regionData = this.weatherData[region];
    regionData.forEach((city, index) => {
      const marker = this.createWeatherMarker(city, index, region);
      markersContainer.appendChild(marker);
    });

    // Update globe rotation with smooth transition
    const globe = document.getElementById("animated-globe");
    if (globe) {
      const rotations = {
        americas: "rotateY(20deg) rotateX(-10deg)",
        europe: "rotateY(-40deg) rotateX(-5deg)",
        asia: "rotateY(-120deg) rotateX(-8deg)",
        africa: "rotateY(-80deg) rotateX(5deg)",
      };

      globe.style.transform = rotations[region];
      globe.style.transition = "transform 1.5s cubic-bezier(0.4, 0, 0.2, 1)";
    }
  }

  createWeatherMarker(city, index, region) {
    const marker = document.createElement("div");

    // Determine weather class based on condition
    let weatherClass = "cloudy";
    if (city.weather.includes("sunny") || city.weather.includes("clear"))
      weatherClass = "sunny";
    else if (city.weather.includes("rain") || city.weather.includes("storm"))
      weatherClass = "rainy";
    else if (city.weather.includes("cloud")) weatherClass = "cloudy";

    marker.className = `weather-marker ${weatherClass}`;

    // More realistic positioning based on region and city distribution
    const regionPositions = {
      americas: [
        { top: "35%", left: "25%" }, // New York area
        { top: "45%", left: "15%" }, // Los Angeles area
        { top: "55%", left: "30%" }, // Mexico City area
        { top: "75%", left: "45%" }, // São Paulo area
        { top: "30%", left: "28%" }, // Toronto area
        { top: "80%", left: "42%" }, // Buenos Aires area
      ],
      europe: [
        { top: "25%", left: "48%" }, // London
        { top: "30%", left: "52%" }, // Paris
        { top: "45%", left: "55%" }, // Rome
        { top: "28%", left: "55%" }, // Berlin
        { top: "40%", left: "48%" }, // Madrid
        { top: "27%", left: "50%" }, // Amsterdam
      ],
      asia: [
        { top: "40%", left: "75%" }, // Tokyo
        { top: "35%", left: "65%" }, // Beijing
        { top: "60%", left: "58%" }, // Mumbai
        { top: "38%", left: "70%" }, // Seoul
        { top: "65%", left: "62%" }, // Bangkok
        { top: "55%", left: "60%" }, // Dubai
      ],
      africa: [
        { top: "35%", left: "52%" }, // Cairo
        { top: "85%", left: "50%" }, // Cape Town
        { top: "58%", left: "48%" }, // Lagos
        { top: "70%", left: "55%" }, // Nairobi
        { top: "40%", left: "45%" }, // Marrakech
        { top: "78%", left: "53%" }, // Johannesburg
      ],
    };

    const positions = regionPositions[region] || regionPositions.americas;
    const pos = positions[index] || positions[0];

    marker.style.top = pos.top;
    marker.style.left = pos.left;
    marker.style.transform = "translate(-50%, -50%)";

    // Enhanced marker with country flag emoji (simplified)
    const flagEmojis = {
      USA: "🇺🇸",
      Mexico: "🇲🇽",
      Brazil: "🇧🇷",
      Canada: "🇨🇦",
      Argentina: "🇦🇷",
      UK: "🇬🇧",
      France: "🇫🇷",
      Italy: "🇮🇹",
      Germany: "🇩🇪",
      Spain: "🇪🇸",
      Netherlands: "🇳🇱",
      Japan: "🇯🇵",
      China: "🇨🇳",
      India: "🇮🇳",
      "South Korea": "🇰🇷",
      Thailand: "🇹🇭",
      UAE: "🇦🇪",
      Egypt: "🇪🇬",
      "South Africa": "🇿🇦",
      Nigeria: "🇳🇬",
      Kenya: "🇰🇪",
      Morocco: "🇲🇦",
    };

    // Add click event with enhanced information
    marker.addEventListener("click", () => this.showCityWeather(city));

    // Enhanced tooltip with more information
    marker.title = `${flagEmojis[city.country] || "🏙️"} ${city.name}, ${
      city.country
    }\n${city.temp}°C - ${city.weather}\nClick for detailed forecast`;

    // Add a subtle pulse animation for active weather events
    if (city.weather.includes("storm") || city.weather.includes("rain")) {
      marker.style.animation = "pulse 2s infinite";
    }

    return marker;
  }

  showCityWeather(city) {
    // Enhanced weather display with more professional information
    const weatherEmojis = {
      sunny: "☀️",
      clear: "🌞",
      cloudy: "☁️",
      "partly cloudy": "⛅",
      rainy: "🌧️",
      thunderstorm: "⛈️",
      humid: "💨",
      windy: "🌪️",
    };

    const emoji = weatherEmojis[city.weather] || "🌡️";

    toastFunction(
      `${emoji} ${city.name}, ${city.country} - ${city.temp}°C, ${city.weather}`
    );

    // Update main weather display with the selected city
    document.querySelector(".weather-component__search-bar").value = city.name;
    weather.fetchWeather(city.name);
  }
}

let voiceCommands; // Make voiceCommands globally accessible

// 4. Smart Weather Notifications
class SmartNotifications {
  constructor() {
    this.userPreferences = this.loadUserPreferences();
    this.setupNotificationSystem();
  }

  loadUserPreferences() {
    return (
      JSON.parse(localStorage.getItem("weatherPreferences")) || {
        notificationsEnabled: false,
        preferredActivities: ["outdoor", "sports", "photography"],
        temperatureRange: { min: 15, max: 25 },
      }
    );
  }

  saveUserPreferences() {
    localStorage.setItem(
      "weatherPreferences",
      JSON.stringify(this.userPreferences)
    );
  }

  setupNotificationSystem() {
    if ("Notification" in window) {
      if (Notification.permission === "default") {
        Notification.requestPermission().then((permission) => {
          if (permission === "granted") {
            this.userPreferences.notificationsEnabled = true;
            this.saveUserPreferences();
            this.scheduleSmartNotifications();
          }
        });
      }
    }
  }

  scheduleSmartNotifications() {
    // Check weather conditions periodically and send smart notifications
    setInterval(() => {
      this.checkForOptimalConditions();
    }, 60000 * 30); // Check every 30 minutes
  }

  checkForOptimalConditions() {
    // This would analyze current weather and user preferences
    // For demo, we'll show a sample notification
    if (this.userPreferences.notificationsEnabled && Math.random() > 0.9) {
      this.sendSmartNotification(
        "🌟 Perfect Weather Alert!",
        "Current conditions are ideal for outdoor photography. Golden hour starts in 2 hours!"
      );
    }
  }

  sendSmartNotification(title, body) {
    if (Notification.permission === "granted") {
      new Notification(title, {
        body: body,
        icon: "./assets/weather-icon.png",
        badge: "./assets/weather-icon.png",
      });
    }
  }
}

// Initialize all unique features
function initializeApp() {
  // Initialize theme manager first for proper styling
  initThemeManager();

  document.getElementsByName("search-bar")[0].focus();
  fetchNewBackground();
  initLocationAndWeather();
  scrollTop();

  voiceCommands = new VoiceWeatherCommands();
  const timeMachine = new WeatherTimeMachine();
  const weatherGlobe = new WeatherGlobe();
  const smartNotifications = new SmartNotifications();

  console.log("Weather features initialized");
}

// Initialize Theme Manager
let themeManager = null;
let themeBackgroundManager = null;

function initThemeManager() {
  try {
    themeManager = new ThemeManager();

    // Initialize theme-aware background manager
    if (window.ThemeBackgroundManager) {
      themeBackgroundManager = new window.ThemeBackgroundManager(themeManager);
    }

    // Listen for theme changes to update weather components
    document.addEventListener("themeChanged", (e) => {
      console.log("🎨 Theme changed to:", e.detail.theme);

      // Update any theme-dependent components
      updateWeatherComponentsForTheme(e.detail.theme);
    });

    console.log("✅ Theme Manager initialized successfully");
  } catch (error) {
    console.error("❌ Failed to initialize Theme Manager:", error);
  }
}

// Update weather components when theme changes
function updateWeatherComponentsForTheme(theme) {
  // Update map tiles if needed
  if (_weatherMap) {
    // You can add theme-specific map styling here if needed
    console.log("🗺️ Map theme updated to:", theme);
  }

  // Update any other theme-dependent components
  // This is where you can add custom theme logic for specific components
}

document.addEventListener("DOMContentLoaded", initializeApp);
