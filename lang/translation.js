// Using https://openweathermap.org/current#multi to get correct apiLang

export function getUserLanguage() {

  if (Object.keys(translations).includes(navigator.language) === true) {
    return navigator.language;
  }

  return null;
}

export const translations = {
  "en-US": {
    apiLang: "en",
    formattingLocale: "en-US",
    airQuality: "Air Quality",
    good: "Good",
    satisfactory: "Satisfactory",
    sensitive: "Sensitive",
    unhealthy: "Unhealthy",
    veryUnhealthy: "Very Unhealthy",
    hazardous: "Hazardous",
    weatherIn: "Weather in",
    humidity: "Humidity",
    windSpeed: "Wind speed",
    sunrise: "Sunrise",
    sunset: "Sunset",
    noWeatherFound: "No weather found.",
    search: "Search",
    pleaseAddLocation: "Please add a location.",
    monday: "Monday",
    tuesday: "Tuesday",
    wednesday: "Wednesday",
    thursday: "Thursday",
    friday: "Friday",
    saturday: "Saturday",
    sunday: "Sunday",
    day: "Day",
    night: "Night"
  },
  "pt-BR": {
    apiLang: "pt_br",
    formattingLocale: "pt-BR",
    airQuality: "Qual. do Ar",
    good: "Bom",
    satisfactory: "Satisfatório",
    sensitive: "Limítrofe",
    unhealthy: "Insalubre",
    veryUnhealthy: "Muito Insalubre",
    hazardous: "Perigoso",
    weatherIn: "Tempo em",
    humidity: "Umidade",
    windSpeed: "Vel. vento",
    sunrise: "Nasc. do Sol",
    sunset: "Pôr do Sol",
    noWeatherFound: "Tempo não encontrado.",
    search: "Pesquisar",
    pleaseAddLocation: "Adicione uma localização.",
    monday: "Segunda-feira",
    tuesday: "Terça-feira",
    wednesday: "Quarta-feira",
    thursday: "Quinta-feira",
    friday: "Sexta-feira",
    saturday: "Sábado",
    sunday: "Domingo",
    day: "Dia",
    night: "Noite"
  },
  "es-MX": {
    apiLang: "es",
    formattingLocale: "es-MX",
    airQuality: "Calidad De Aire",
    good: "Buena",
    satisfactory: "Satisfactoria",
    sensitive: "Sensible",
    unhealthy: "Dañino",
    veryUnhealthy: "Muy Dañino",
    hazardous: "Peligroso",
    weatherIn: "Clima en",
    humidity: "Humedad",
    windSpeed: "Velocidad Del Viento",
    sunrise: "Amanecer",
    sunset: "Anochecer",
    noWeatherFound: "No se encontró ningun clima.",
    search: "Buscar",
    pleaseAddLocation: "Por favor agrega una localización.",
    monday: "Lunes",
    tuesday: "Martes",
    wednesday: "Miercoles",
    thursday: "Jueves",
    friday: "Viernes",
    saturday: "Sabado",
    sunday: "Domingo",
    day: "Día",
    night: "Noche"
  },
  "de-DE": {
    apiLang: "de",
    formattingLocale: "de-DE",
    airQuality: "Luftqualität",
    good: "Gut",
    satisfactory: "Zufriedenstellend",
    sensitive: "Sensitiv",
    unhealthy: "Ungesund",
    veryUnhealthy: "Sehr Ungesund",
    hazardous: "Gefährlich",
    weatherIn: "Wetter in",
    humidity: "Feuchtigkeit",
    windSpeed: "Windgeschwindigkeit",
    sunrise: "Sonnenaufgang",
    sunset: "Sonnenuntergang",
    noWeatherFound: "Keine Wetterdaten gefunden.",
    search: "Suche",
    pleaseAddLocation: "Bitte gib einen Ort an.",
    monday: "Montag",
    tuesday: "Dienstag",
    wednesday: "Mittwoch",
    thursday: "Donnerstag",
    friday: "Freitag",
    saturday: "Samstag",
    sunday: "Sonntag",
    day: "Tag",
    night: "Nacht"
  },
};

// en-US is valid, but "en" only too
// Therefore we add the language without the country code too
// To prevent error for stuff like en-GB, we do it manually
translations["en"] = translations["en-US"];
translations["pt"] = translations["pt-BR"];
translations["de"] = translations["de-DE"];
