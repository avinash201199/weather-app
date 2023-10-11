import React from "react";

import NavBar from "./components/UI/NavBar/NavBar";

import "./App.css";
import HeroWrapper from "./components/UI/HeroWrapper/HeroWrapper";
import TodayWeather from "./components/SideBar/TodayWeather/TodayWeather";
import Hero from "./components/Hero/Hero";

const App = () => {
	return (
		<React.Fragment>
			<NavBar />
			<HeroWrapper>
				<Hero />
				<TodayWeather />
			</HeroWrapper>
		</React.Fragment>
	);
};

export default App;
