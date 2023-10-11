import React from "react";
import SearchSection from "./SearchSection/SearchSection";

import nasa from "../../assets/nasa-image.png"

import styles from "./Hero.module.css";
import TempratureGraph from "./Chart/TempratureGraph";
import SurfaceGraph from "./Chart/SurfacePressureGraph";

const Hero = () => {
	const tempData = {
		labels: [
			"0",
			"2",
			"4",
			"6",
			"8",
			"10",
			"12",
			"14",
			"16",
			"18",
			"20",
			"22",
			"24",
		],
		values: [
			19.05, 21.37, 22.42, 22.33, 23.58, 22.85, 20.9, 20.22, 19.73, 19.29,
			18.9, 18.62, 19,
		],
		label: "Temprature in Celsius Vs. Time in hours",
		labelColor: "white",
	};

	return (
		<div className={styles["wrapper"]}>
			<SearchSection />
			<div className={styles["another-wrapper"]}>
				<TempratureGraph
					dataBar={tempData}
					width="50px"
					height="50px"
					labelColor={tempData.labelColor}
				/>
				<SurfaceGraph width="50px" height="50px" />
			</div>
			<div className={styles["spaceImg"]}>
				<img src={nasa} className={styles["spaceImgAct"]} />
			</div>
		</div>
	);
};

export default Hero;
