import React, { useEffect, useState } from "react";

const LocationContext = React.createContext({
	latitude: 27.62,
	longitude: 85.429,
	country: "nepal",
	countryCode: "NPL",
	city: "bhaktapur",
	weather: {},
	onChangeLocation: (lat, lng) => {},
});

export const LocationContextProvider = (props) => {
	const [dataPos, setDataPos] = useState({
		latitude: 27.62,
		longitude: 85.429,
		country: "nepal",
		countryCode: "NP",
		weather: {},
		city: "bhaktapur",
	});

	const [weatherData, setWeatherData] = useState({
		weatherDescription: "",
		icon: "",
		feels: 0,
		temperature: 0,
		minTemp: 0,
		maxTemp: 0,
		prssure: 0,
		humidity: 0,
		visibility: 0,
		windSpeed: 0,
		sunrise: 0,
		sunset: 0,
	});

	useEffect(() => {
		fetch(
			`https://api.openweathermap.org/data/2.5/weather?lat=${dataPos.latitude}&lon=${dataPos.longitude}&units=metric&appid=e73ab71246cd8b4a162482332030a10d`
		)
			.then((response) => response.json())
			.then((data) => {
				setWeatherData({
					weatherDescription: data.weather[0].description,
					icon: data.weather[0].icon,
					feels: data.main.feels_like,
					temperature: data.main.temp,
					minTemp: data.main.temp_min,
					maxTemp: data.main.temp_max,
					pressure: data.main.pressure,
					humidity: data.main.humidity,
					visibility: data.visibility,
					windSpeed: data.wind.speed,
					sunrise: data.sys.sunrise,
					sunset: data.sys.sunset,
					timezone: data.timezone,
				});
			});
	}, []);

	const locationChangeHandler = (lat, lng) => {
		fetch(
			`https://api.geocode.earth/v1/reverse?api_key=ge-833ff4969a1ce1de&point.lat=${lat}&point.lon=${lng}`
		)
			.then((response) => response.json())
			.then((data) => {
				setDataPos({
					latitude: lat,
					longitude: lng,
					country: data.features[0].properties.country,
					countryCode: data.features[0].properties.country_code,
					city: data.features[0].properties.county,
				});
			});

		fetch(
			`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&appid=e73ab71246cd8b4a162482332030a10d`
		)
			.then((response) => response.json())
			.then((data) => {
				setWeatherData({
					weatherDescription: data.weather[0].description,
					icon: data.weather[0].icon,
					feels: data.main.feels_like,
					temperature: data.main.temp,
					minTemp: data.main.temp_min,
					maxTemp: data.main.temp_max,
					pressure: data.main.pressure,
					humidity: data.main.humidity,
					visibility: data.visibility,
					windSpeed: data.wind.speed,
					sunrise: data.sys.sunrise,
					sunset: data.sys.sunset,
					timezone: data.timezone,
				});
			});
	};

	return (
		<LocationContext.Provider
			value={{
				latitude: dataPos.latitude,
				longitude: dataPos.longitude,
				country: dataPos.country,
				countryCode: dataPos.countryCode,
				city: dataPos.city,

				weather: { ...weatherData },
				onChangeLocation: locationChangeHandler,
			}}
		>
			{props.children}
		</LocationContext.Provider>
	);
};

export default LocationContext;
