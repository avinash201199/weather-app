// Weather Tips Utility
// Provides contextual advice based on current weather conditions

export function getWeatherTip(weatherData) {
  const { main, weather, wind } = weatherData;
  const { temp, humidity } = main;
  const { description, main: condition } = weather[0];
  const { speed: windSpeed } = wind;
  
  // Get air quality from DOM (since it's loaded separately)
  const airQualityElement = document.querySelector("#AirQuality");
  const aqi = airQualityElement ? parseInt(airQualityElement.innerText) : null;
  
  const tips = [];
  
  // Temperature-based tips
  if (temp > 35) {
    tips.push({
      text: "Hot day ahead — stay hydrated and seek shade! 💧",
      priority: "high",
      icon: "🌡️"
    });
  } else if (temp < 5) {
    tips.push({
      text: "Bundle up — it's chilly outside! 🧥",
      priority: "high", 
      icon: "🥶"
    });
  } else if (temp >= 20 && temp <= 30) {
    tips.push({
      text: "Perfect weather — enjoy your day! 🌤️",
      priority: "low",
      icon: "😊"
    });
  }
  
  // Weather condition tips
  const conditionLower = condition.toLowerCase();
  const descriptionLower = description.toLowerCase();
  
  if (conditionLower === 'rain' || descriptionLower.includes('rain')) {
    tips.push({
      text: "Rainy day — carry an umbrella! ☔",
      priority: "high",
      icon: "🌧️"
    });
  } else if (conditionLower === 'snow' || descriptionLower.includes('snow')) {
    tips.push({
      text: "Snow expected — drive carefully! ❄️",
      priority: "high",
      icon: "🌨️"
    });
  } else if (conditionLower === 'thunderstorm') {
    tips.push({
      text: "Storm warning — stay indoors! ⚡",
      priority: "critical",
      icon: "⛈️"
    });
  } else if (conditionLower === 'clear' || conditionLower === 'sun') {
    tips.push({
      text: "Sunny skies — perfect for outdoor activities! ☀️",
      priority: "low",
      icon: "🌞"
    });
  } else if (conditionLower === 'clouds') {
    tips.push({
      text: "Cloudy day — good for a walk! ☁️",
      priority: "low",
      icon: "🌥️"
    });
  }
  
  // Humidity tips
  if (humidity > 80) {
    tips.push({
      text: "High humidity — may feel sticky! 💨",
      priority: "medium",
      icon: "💧"
    });
  } else if (humidity < 30) {
    tips.push({
      text: "Dry air — keep your skin moisturized! 🧴",
      priority: "medium",
      icon: "🌵"
    });
  }
  
  // Wind speed tips
  if (windSpeed > 15) {
    tips.push({
      text: "Windy conditions — hold onto your hat! 💨",
      priority: "medium",
      icon: "🌪️"
    });
  }
  
  // Air quality tips
  if (aqi) {
    if (aqi > 200) {
      tips.push({
        text: "Poor air quality — stay indoors! 😷",
        priority: "critical",
        icon: "🏭"
      });
    } else if (aqi > 150) {
      tips.push({
        text: "Unhealthy air — consider wearing a mask! 😷",
        priority: "high",
        icon: "⚠️"
      });
    } else if (aqi > 100) {
      tips.push({
        text: "Moderate air quality — sensitive people take care! 👃",
        priority: "medium",
        icon: "🌫️"
      });
    } else if (aqi <= 50) {
      tips.push({
        text: "Great air quality — breathe easy! 🌬️",
        priority: "low",
        icon: "🌿"
      });
    }
  }
  
  // Time-based tips
  const hour = new Date().getHours();
  if (hour >= 6 && hour <= 10) {
    tips.push({
      text: "Good morning! Start your day right! 🌅",
      priority: "low",
      icon: "☀️"
    });
  } else if (hour >= 18 && hour <= 21) {
    tips.push({
      text: "Evening time — perfect for a sunset walk! 🌅",
      priority: "low",
      icon: "🌆"
    });
  }
  
  // Return the highest priority tip, or a random one if multiple same priority
  if (tips.length === 0) {
    return {
      text: "Stay weather-aware and have a great day! 🌈",
      priority: "low",
      icon: "🌈"
    };
  }
  
  // Sort by priority (critical > high > medium > low)
  const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
  tips.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
  
  // Return the highest priority tip
  return tips[0];
}

export function displayWeatherTip(tip) {
  const tipContainer = document.getElementById('weather-tip');
  if (!tipContainer) return;
  
  // Add fade out animation
  tipContainer.style.opacity = '0';
  tipContainer.style.transform = 'translateY(-10px)';
  
  setTimeout(() => {
    // Update content
    tipContainer.innerHTML = `
      <div class="tip-content">
        <span class="tip-icon">${tip.icon}</span>
        <span class="tip-text">${tip.text}</span>
      </div>
    `;
    
    // Add fade in animation
    tipContainer.style.opacity = '1';
    tipContainer.style.transform = 'translateY(0)';
  }, 200);
}
