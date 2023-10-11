import { useContext, useEffect, useState } from "react";
import LocationContext from "../../../store/location-context";

import styles from "./SearchSection.module.css";

const months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

const SearchSection = () => {
	const ctx = useContext(LocationContext);

	const [time, setTime] = useState(new Date());
	const [location, setLocation] = useState("");

	const handleInputChange = (event) => {
		if (event.key === "Enter") {
			setLocation(event.target.value);
		}
	};

	useEffect(() => {
		if (location === null || location.length === 0) {
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition((geoloc) =>
					ctx.onChangeLocation(
						geoloc.coords.latitude,
						geoloc.coords.longitude
					)
				);
			}
		} else {
			fetch(
				`https://api.geocode.earth/v1/search?api_key=ge-833ff4969a1ce1de&text=${location}`
			)
				.then((response) => response.json())
				.then((data) => {
					ctx.onChangeLocation(
						data.features[0].geometry.coordinates[1],
						data.features[0].geometry.coordinates[0]
					);
				});
		}
	}, [location]);
	
	useEffect(() => {
		const intervalId = setInterval(() => {
			setTime(new Date());
		}, 1000);

		return () => clearInterval(intervalId);
	}, []);

	
	// Format the minute with a leading zero
	const formattedMinutes = time.getMinutes().toString().padStart(2, '0');

	return (
		<div className={styles["hero__header"]}>
			<div className={styles["hero__header__time"]}>
				<div className={styles["hero__header__time--info"]}>
					<p>{`${time.getHours()} : ${formattedMinutes}`}</p>
					<p>{`${months[time.getMonth()]} ${time.getDate()}, ${time.getFullYear()}`}</p>
				</div>
				<img
					src={`https://flagsapi.com/${ctx.countryCode}/shiny/64.png`}
					alt="Flag"
				/>
			</div>
			<div className={styles["hero__header__search"]}>
				<input
					type="text"
					placeholder="Enter your location..."
					onKeyDown={handleInputChange}
				/>
			</div>
		</div>
	);
};

export default SearchSection;
