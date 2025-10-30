// Weather API service module
import config from '../../config/config.js';
import { sanitizeInput, validateCityName } from './security.js';

class WeatherService {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 10 * 60 * 1000; // 10 minutes
  }

  async fetchWeather(city = null, lat = null, lon = null) {
    const cacheKey = city || `${lat},${lon}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }

    let url;
    if (lat && lon) {
      url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${config.API_KEY}`;
    } else {
      if (!validateCityName(city)) throw new Error('INVALID_CITY_NAME');
      const sanitizedCity = sanitizeInput(city);
      url = `https://api.openweathermap.org/data/2.5/weather?q=${sanitizedCity}&units=metric&appid=${config.API_KEY}`;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    try {
      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);
      
      if (!response.ok) throw new Error(`HTTP_${response.status}`);
      
      const data = await response.json();
      this.cache.set(cacheKey, { data, timestamp: Date.now() });
      return data;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  async fetchAirQuality(city) {
    try {
      const sanitizedCity = sanitizeInput(city);
      const url = `https://api.waqi.info/v2/search/?token=${config.AIR_KEY}&keyword=${sanitizedCity}`;
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);
      
      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);
      
      if (!response.ok) throw new Error('AQI_FETCH_FAILED');
      
      const data = await response.json();
      return data?.data?.[0]?.aqi || null;
    } catch (error) {
      console.warn('Air quality fetch failed:', error.message);
      return null;
    }
  }
}

export default new WeatherService();