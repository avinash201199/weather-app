// DOM manipulation utilities
class DOMManager {
  constructor() {
    this.elements = this.cacheElements();
  }

  cacheElements() {
    return {
      searchBar: document.querySelector('.weather-component__search-bar'),
      cityName: document.getElementById('city'),
      temperature: document.getElementById('temp'),
      description: document.getElementById('description'),
      humidity: document.getElementById('humidity'),
      wind: document.getElementById('wind'),
      sunrise: document.getElementById('sunrise'),
      sunset: document.getElementById('sunset'),
      airQuality: document.getElementById('AirQuality'),
      weatherIcon: document.getElementById('icon'),
      errorMessage: document.getElementById('error-message'),
      toast: document.getElementById('toast'),
      toastMessage: document.getElementById('toast-message')
    };
  }

  updateWeatherDisplay(data) {
    const { elements } = this;
    const { name } = data;
    const { icon, description } = data.weather[0];
    const { temp, humidity } = data.main;
    const { speed } = data.wind;

    if (elements.cityName) elements.cityName.textContent = name;
    if (elements.temperature) elements.temperature.textContent = `${Math.round(temp)}°C`;
    if (elements.description) elements.description.textContent = description;
    if (elements.humidity) elements.humidity.textContent = `${humidity}%`;
    if (elements.wind) elements.wind.textContent = `${speed} km/h`;
  }

  showError(message) {
    if (this.elements.errorMessage) {
      this.elements.errorMessage.textContent = message;
      this.elements.errorMessage.hidden = false;
    }
  }

  hideError() {
    if (this.elements.errorMessage) {
      this.elements.errorMessage.hidden = true;
    }
  }

  showToast(message, type = 'info') {
    const { toast, toastMessage } = this.elements;
    if (!toast || !toastMessage) return;

    toastMessage.textContent = message;
    toast.className = `toast show ${type}`;
    
    setTimeout(() => {
      toast.classList.remove('show');
    }, 4000);
  }
}

export default new DOMManager();