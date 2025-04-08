import { Link } from "react-router-dom";

export default function Home() {
	return (
		<div>
					<div className="mb-8">
			<h2 className="text-2xl font-semibold mb-4 text-gray-800">Analog Modulation</h2>
			<ul className="space-y-3 pl-4">
				<li>
					<Link to="/am" className="text-blue-600 hover:text-blue-800 hover:underline">
						Amplitude Modulation (AM)
					</Link>
				</li>
				<li>
					<Link to="/fm" className="text-blue-600 hover:text-blue-800 hover:underline">
						Frequency Modulation (FM)
					</Link>
				</li>
				<li>
					<Link to="/pm" className="text-blue-600 hover:text-blue-800 hover:underline">
						Phase Modulation (PM)
					</Link>
				</li>
			</ul>
		</div>
		
		<div className="mb-8">
			<h2 className="text-2xl font-semibold mb-4 text-gray-800">Digital Modulation</h2>
			<div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
				<p className="text-gray-600 italic">
					Digital modulation techniques (ASK, FSK, PSK, QAM) coming soon...
				</p>
			</div>
		</div>
		
		<div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
			<p className="text-indigo-700">
				<strong>More modulation techniques in progress!</strong> This interactive visualizer helps you understand how different modulation schemes work by showing both the time and frequency domain representations.
			</p>
		</div>
	</div>
);
};
