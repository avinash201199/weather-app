import styles from "./WeatherUpdate.module.css";

const WeatherUpdate = ({ title, msg }) => {
	return (
		<div className={styles["weather__card"]}>
			<p>! {title}</p>
			<p>{msg}</p>
		</div>
	);
};

export default WeatherUpdate;
