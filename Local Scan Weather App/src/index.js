import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import { LocationContextProvider } from "./store/location-context";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
	<LocationContextProvider>
		<App />
	</LocationContextProvider>
);
