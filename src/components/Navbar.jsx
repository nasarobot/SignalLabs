// src/components/Navbar.jsx
import { Link } from "react-router-dom";

export default function Navbar() {
	return (
		<nav className="bg-[#24292e] p-4 text-white">
			<div className="max-w-screen-lg mx-auto flex justify-between items-center">
				<Link to="/" className="text-xl font-semibold">
					SignalLab
				</Link>
				<div className="space-x-4 text-sm">
					<Link to="/am" className="hover:underline">
						AM
					</Link>
					<Link to="/fm" className="hover:underline">
						FM
					</Link>
					<Link to="/pm" className="hover:underline">
						PM
					</Link>
				</div>
			</div>
		</nav>
	);
}
