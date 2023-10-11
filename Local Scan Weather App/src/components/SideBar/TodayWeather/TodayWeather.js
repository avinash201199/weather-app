import { useContext } from "react";
import LocationContext from "../../../store/location-context";

import { FaLocationDot } from "react-icons/fa6";
import styles from "./TodayWeather.module.css";
import WeatherUpdate from "../WeatherUpdate/WeatherUpdate";

const TodayWeather = () => {
	const ctx = useContext(LocationContext);

	return (
		<div className={styles["wrapper"]}>
			<div className={styles["wrapper__info"]}>
				<p>
					<FaLocationDot />{" "}
					<span style={{textTransform: "capitalize"}}>
						{typeof ctx.city != "undefined"
							? `${ctx.city} , ${ctx.country}`
							: ctx.country}
					</span>
				</p>
				<p>
					<img
						src={`https://openweathermap.org/img/wn/${ctx.weather.icon}@2x.png`}
					/>
				</p>
				<p>
					<span>{ctx.weather.temperature}</span>&deg;
				</p>
				<p style={{ textTransform: "capitalize" }}>
					{ctx.weather.weatherDescription}
				</p>
				<p>Feels like: {ctx.weather.feels}&deg;</p>
			</div>

			<div className={styles["wrapper__messages"]}>
				<WeatherUpdate
					title="NASA Space App Challenge"
					msg="The NASA International Space Apps challenge will be held October 7-8, 2023."
				/>
				<WeatherUpdate
					title="Total Lunar Eclipse"
					msg="7 to 8 September 2025 Total Lunar Eclipse visible from Nepal."
				/>
				<WeatherUpdate
					title="Opportunity to observer a comet"
					msg="Comet 55P/Tempel-Tuttle comes to perihelion, 2031 May 20"
				/>
			</div>
		</div>
	);
};

export default TodayWeather;
