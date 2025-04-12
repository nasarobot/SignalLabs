import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import AMModulation from "./pages/analog/AMModulation";
import FMModulation from "./pages/analog/FMModulation";
import PMModulation from "./pages/analog/PMModulation";
import "katex/dist/katex.min.css";
import "./App.css";

function App() {
	return (
		<>
			<Navbar />
			<div className="bg-white min-h-screen py-8 px-4">
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/am" element={<AMModulation />} />
					<Route path="/fm" element={<FMModulation />} />
					<Route path="/pm" element={<PMModulation />} />
				</Routes>
			</div>
		</>
	);
}

export default App;
