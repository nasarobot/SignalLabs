// AMModulation.jsx
import React, { useState } from "react";
import { InlineMath, BlockMath } from "react-katex";
import Plot from "react-plotly.js";
import { computeAMModulation } from "../../lib/ammodulation";
import { computeAMDemodulation } from "../../lib/amdemodulation";
import { computeFFT } from "../../lib/computeFFT";

const AMModulation = () => {
	// Interactive state parameters
	const [Am, setAm] = useState(0.8);
	const [Ac, setAc] = useState(1.0);
	const [messageType, setMessageType] = useState("sine");
	const [fc, setFc] = useState(10000); // Add carrier frequency control
	const [fm, setFm] = useState(500); // Add message frequency control
	const [fftSize, setFftSize] = useState(8192);
	const [filterCutoff, setFilterCutoff] = useState(1.5); // Multiplier of fm (1.5 * fm)
	const [filterOrder, setFilterOrder] = useState(3);

	// Fixed parameters
	const fs = 500000;
	const duration = 0.02;

	// Calculate modulation index
	const modulationIndex = Am / Ac;

	const { t, message, modulated } = computeAMModulation(
		fs,
		duration,
		fc,
		fm,
		Am,
		Ac,
		messageType
	);
	// const fftsize = 8192;
	const { frequencies, magnitudes } = computeFFT(modulated, fs, fftSize);
	const demodulated = computeAMDemodulation(modulated, fs, fc, fm, filterCutoff, filterOrder);

	return (
		<div className="p-4 max-w-6xl mx-auto">
			<h1 className="text-3xl font-bold mb-6 text-indigo-600 text-center">
				Amplitude Modulation and Demodulation
			</h1>

			{/* AM Modulation Theory */}
			<section className="mb-8 bg-gray-50 p-6 rounded-lg shadow-sm">
				<h2 className="text-2xl font-bold mb-4 text-indigo-600">
					AM Modulation Theory
				</h2>

				<div className="mb-4">
					<p className="mb-2">
						Amplitude Modulation (AM) is a modulation technique
						where the amplitude of the carrier signal varies in
						proportion to the message signal, while the frequency
						remains constant.
					</p>

					<p className="mb-2">
						The AM modulated signal <InlineMath math="s_{AM}(t)" />{" "}
						is expressed as:
					</p>
					<BlockMath math="s_{AM}(t) = (A_c + A_m \cdot m(t)) \sin(2\pi f_c t)" />

					<p className="mb-2">
						Which can also be written in the standard form:
					</p>
					<BlockMath math="s_{AM}(t) = A_c [1 + \mu \cdot m(t)] \sin(2\pi f_c t)" />

					<p className="mb-2">
						Where <InlineMath math="\mu = \frac{A_m}{A_c}" /> is the
						modulation index.
					</p>

					<p className="mb-2">
						In our implementation, we use a {messageType} message
						signal with:
					</p>
					<ul className="list-disc pl-6 mb-2">
						<li>
							Carrier amplitude{" "}
							<InlineMath math={`A_c = ${Ac}`} />
						</li>
						<li>
							Carrier frequency{" "}
							<InlineMath
								math={`f_c = ${(fc / 1000).toFixed(1)} kHz`}
							/>
						</li>
						<li>
							Message amplitude{" "}
							<InlineMath math={`A_m = ${Am}`} />
						</li>
						<li>
							Message frequency{" "}
							<InlineMath math={`f_m = ${fm} Hz`} />
						</li>
						<li>
							Modulation index{" "}
							<InlineMath
								math={`\\mu = ${modulationIndex.toFixed(2)}`}
							/>
						</li>
					</ul>

					<p className="mb-2">
						For distortion-free demodulation, the modulation index{" "}
						<InlineMath math="\mu" /> should be ≤ 1 to prevent
						overmodulation.
					</p>
				</div>
			</section>

			{/* Interactive Controls - Compact Layout */}
			<section className="mb-6 bg-blue-50 p-4 rounded-lg shadow-sm border border-blue-200">
				<h2 className="text-xl font-bold mb-3 text-indigo-600">
					AM Modulation Parameters
				</h2>

				<div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-4">
					{/* Message Amplitude */}
					<div className="bg-white p-3 rounded-lg shadow-sm">
						<label className="block text-xs font-semibold mb-1 text-gray-700">
							Am: {Am.toFixed(1)}
						</label>
						<input
							type="range"
							min="0.1"
							max="2.0"
							step="0.1"
							value={Am}
							onChange={e => setAm(parseFloat(e.target.value))}
							className="w-full h-1 bg-blue-200 rounded-lg appearance-none cursor-pointer"
						/>
					</div>

					{/* Carrier Amplitude */}
					<div className="bg-white p-3 rounded-lg shadow-sm">
						<label className="block text-xs font-semibold mb-1 text-gray-700">
							Ac: {Ac.toFixed(1)}
						</label>
						<input
							type="range"
							min="0.5"
							max="2.0"
							step="0.1"
							value={Ac}
							onChange={e => setAc(parseFloat(e.target.value))}
							className="w-full h-1 bg-blue-200 rounded-lg appearance-none cursor-pointer"
						/>
					</div>

					{/* Carrier Frequency */}
					<div className="bg-white p-3 rounded-lg shadow-sm">
						<label className="block text-xs font-semibold mb-1 text-gray-700">
							fc: {(fc / 1000).toFixed(1)}kHz
						</label>
						<input
							type="range"
							min="5000"
							max="20000"
							step="500"
							value={fc}
							onChange={e => setFc(parseInt(e.target.value))}
							className="w-full h-1 bg-blue-200 rounded-lg appearance-none cursor-pointer"
						/>
					</div>

					{/* Message Frequency */}
					<div className="bg-white p-3 rounded-lg shadow-sm">
						<label className="block text-xs font-semibold mb-1 text-gray-700">
							fm: {fm}Hz
						</label>
						<input
							type="range"
							min="100"
							max="1000"
							step="50"
							value={fm}
							onChange={e => setFm(parseInt(e.target.value))}
							className="w-full h-1 bg-blue-200 rounded-lg appearance-none cursor-pointer"
						/>
					</div>

					{/* Message Type */}
					<div className="bg-white p-3 rounded-lg shadow-sm">
						<label className="block text-xs font-semibold mb-1 text-gray-700">
							Signal Type
						</label>
						<select
							value={messageType}
							onChange={e => setMessageType(e.target.value)}
							className="w-full p-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500">
							<option value="sine">Sine</option>
							<option value="triangle">Triangle</option>
							<option value="square">Square</option>
						</select>
					</div>
					{/* FFT Size */}
					<div className="bg-white p-3 rounded-lg shadow-sm">
						<label className="block text-xs font-semibold mb-1 text-gray-700">
							FFT Size
						</label>
						<select
							value={fftSize}
							onChange={e => setFftSize(parseInt(e.target.value))}
							className="w-full p-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500">
							<option value={1024}>1024</option>
							<option value={2048}>2048</option>
							<option value={4096}>4096</option>
							<option value={8192}>8192</option>
							<option value={16384}>16384</option>
						</select>
					</div>
				</div>

				{/* Calculated Values - Horizontal Layout */}
				<div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
					<div className="flex items-center justify-between p-2 bg-white rounded text-xs">
						<span className="font-medium">μ:</span>
						<span className="font-bold">
							{modulationIndex.toFixed(2)}
						</span>
					</div>
					<div className="flex items-center justify-between p-2 bg-white rounded text-xs">
						<span className="font-medium">Status:</span>
						<span
							className={`font-bold ${
								modulationIndex > 1
									? "text-red-600"
									: "text-green-600"
							}`}>
							{modulationIndex > 1 ? "Over" : "Normal"}
						</span>
					</div>
					<div className="flex items-center justify-between p-2 bg-white rounded text-xs">
						<span className="font-medium">BW:</span>
						<span className="font-bold">{2 * fm}Hz</span>
					</div>
					<div className="flex items-center justify-between p-2 bg-white rounded text-xs">
						<span className="font-medium">η:</span>
						<span className="font-bold">
							{(
								(Math.pow(modulationIndex, 2) /
									(2 + Math.pow(modulationIndex, 2))) *
								100
							).toFixed(1)}
							%
						</span>
					</div>
				</div>

				{modulationIndex > 1 && (
					<div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs">
						<p className="text-red-700">
							<strong>Warning:</strong> Overmodulation detected.
							Reduce Am or increase Ac.
						</p>
					</div>
				)}
			</section>

			{/* AM Modulation Plot */}
			<section className="mb-8">
				<h2 className="text-2xl font-bold mb-4 text-indigo-600">
					AM Modulation Visualization
				</h2>

				<Plot
					data={[
						{
							x: t,
							y: message,
							type: "scatter",
							mode: "lines",
							name: "Message Signal",
							line: { color: "blue", width: 1 },
						},
						{
							x: t,
							y: modulated,
							type: "scatter",
							mode: "lines",
							name: "AM Signal",
							line: { color: "red", width: 1 },
						},
					]}
					layout={{
						width: 1000,
						height: 400,
						title: `AM Modulation - Time Domain (fc=${(
							fc / 1000
						).toFixed(
							1
						)}kHz, fm=${fm}Hz, μ=${modulationIndex.toFixed(2)})`,
						paper_bgcolor: "#f9fafb",
						plot_bgcolor: "#f9fafb",
						xaxis: { title: "Time (s)" },
						yaxis: { title: "Amplitude" },
					}}
				/>

				<div className="mt-4 bg-blue-50 p-4 rounded-lg">
					<p>
						<strong>Observation:</strong> Notice how the amplitude
						of the red AM signal varies in proportion to the blue
						message signal. The envelope of the AM signal follows
						the shape of the message signal.
						{modulationIndex > 1 && (
							<span className="text-red-600">
								{" "}
								With overmodulation (μ `{">"}` 1), you can see
								envelope distortion where the signal touches
								zero.
							</span>
						)}
					</p>
				</div>

				<h3 className="text-xl font-semibold mt-6 mb-2">
					Frequency Spectrum
				</h3>
				<Plot
					data={[
						{
							x: frequencies,
							y: magnitudes,
							type: "scatter",
							mode: "lines",
							name: "Frequency Spectrum",
							line: { color: "purple", width: 1 },
						},
					]}
					layout={{
						width: 1000,
						height: 300,
						title: "AM Modulation - Frequency Domain",
						paper_bgcolor: "#f9fafb",
						plot_bgcolor: "#f9fafb",
						xaxis: {
							title: "Frequency (Hz)",
							range: [0, Math.min(2 * fc, 50000)],
						},
						yaxis: {
							title: "Magnitude",
							type: "log",
						},
					}}
				/>

				<div className="mt-4 bg-purple-50 p-4 rounded-lg">
					<p>
						<strong>Observation:</strong> The frequency spectrum
						shows the carrier frequency at {(fc / 1000).toFixed(1)}{" "}
						kHz and two sidebands at fc-fm (
						{((fc - fm) / 1000).toFixed(1)} kHz) and fc+fm (
						{((fc + fm) / 1000).toFixed(1)} kHz).
					</p>
				</div>
			</section>

			{/* AM Demodulation Theory */}
			<section className="mb-8 bg-gray-50 p-6 rounded-lg shadow-sm">
				<h2 className="text-2xl font-bold mb-4 text-indigo-600">
					AM Demodulation Theory
				</h2>

				<div className="mb-4">
					<p className="mb-2">
						AM demodulation recovers the original message signal
						from the modulated AM signal. Our implementation uses
						envelope detection, which is one of the simplest
						demodulation techniques.
					</p>

					<p className="mb-2">
						The envelope detection process involves:
					</p>
					<ol className="list-decimal pl-6 mb-2">
						<li>
							Rectification (half-wave rectification to clip
							negative portions)
						</li>
						<li>
							Envelope extraction using a moving average window
						</li>
						<li>
							Low-pass filtering with a 3rd order digital filter
						</li>
						<li>DC component removal using adaptive estimation</li>
					</ol>

					<p className="mb-2">
						Mathematically, we're extracting the envelope of:
					</p>
					<BlockMath math="s_{AM}(t) = (A_c + A_m \cdot m(t)) \sin(2\pi f_c t)" />

					<p className="mb-2">
						Which gives us{" "}
						<InlineMath math="A_c + A_m \cdot m(t)" />. After
						removing the DC component <InlineMath math="A_c" />, we
						get <InlineMath math="A_m \cdot m(t)" />, which is
						proportional to our original message.
					</p>
				</div>
			</section>

			{/* Filter Configuration Section */}
			<section className="mb-6 bg-yellow-50 p-4 rounded-lg shadow-sm border border-yellow-200">
				<h3 className="text-xl font-bold mb-3 text-amber-700">
					Demodulation Filter Configuration
				</h3>

				<div className="grid grid-cols-2 gap-4">
					{/* Filter Cutoff Frequency */}
					<div className="bg-white p-3 rounded-lg shadow-sm">
						<label className="block text-sm font-semibold mb-2 text-gray-700">
							Cutoff Frequency: {filterCutoff.toFixed(1)} × fm ={" "}
							{(filterCutoff * fm).toFixed(0)} Hz
						</label>
						<input
							type="range"
							min="0.5"
							max="5.0"
							step="0.1"
							value={filterCutoff}
							onChange={e =>
								setFilterCutoff(parseFloat(e.target.value))
							}
							className="w-full h-1 bg-blue-200 rounded-lg appearance-none cursor-pointer"
						/>
						<div className="flex justify-between text-xs text-gray-500 mt-1">
							<span>0.5 × fm</span>
							<span>5.0 × fm</span>
						</div>
					</div>

					{/* Filter Order */}
					<div className="bg-white p-3 rounded-lg shadow-sm">
						<label className="block text-sm font-semibold mb-2 text-gray-700">
							Filter Order: {filterOrder} (-{filterOrder * 6}{" "}
							dB/octave)
						</label>
						<input
							type="range"
							min="1"
							max="6"
							step="1"
							value={filterOrder}
							onChange={e =>
								setFilterOrder(parseInt(e.target.value))
							}
							className="w-full h-1 bg-blue-200 rounded-lg appearance-none cursor-pointer"
						/>
						<div className="flex justify-between text-xs text-gray-500 mt-1">
							<span>1st order</span>
							<span>6th order</span>
						</div>
					</div>
				</div>

				{/* Filter Info Display */}
				<div className="mt-3 p-3 bg-white rounded-lg border border-gray-200">
					<div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
						<div className="flex justify-between">
							<span className="font-medium">Cutoff:</span>
							<span className="font-bold">
								{(filterCutoff * fm).toFixed(0)} Hz
							</span>
						</div>
						<div className="flex justify-between">
							<span className="font-medium">Order:</span>
							<span className="font-bold">{filterOrder}</span>
						</div>
						<div className="flex justify-between">
							<span className="font-medium">Roll-off:</span>
							<span className="font-bold">
								-{filterOrder * 6} dB/oct
							</span>
						</div>
						<div className="flex justify-between">
							<span className="font-medium">Type:</span>
							<span className="font-bold">Digital LPF</span>
						</div>
					</div>
				</div>

				{/* Filter Guidelines */}
				<div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-xs">
					<p className="text-blue-700">
						<strong>Note:</strong> Higher cutoff frequencies
						preserve more signal detail but allow more noise. Higher
						order filters provide sharper roll-off but may introduce
						more phase distortion. Recommended: 1.5-2.0 × fm cutoff
						with 2nd-3rd order. Since this simulator doesn't have
						any non-idealities you won't observe any phase
						distortion/noise.
					</p>
				</div>
			</section>

			{/* AM Demodulation Plot */}
			<section className="mb-8">
				<h2 className="text-2xl font-bold mb-4 text-indigo-600">
					AM Demodulation Visualization
				</h2>

				<Plot
					data={[
						{
							x: t.slice(0, demodulated.length),
							y: message.slice(0, demodulated.length),
							type: "scatter",
							mode: "lines",
							name: "Original Message",
							line: { color: "blue", width: 1 },
							yaxis: "y",
						},
						{
							x: t.slice(0, demodulated.length),
							y: demodulated,
							type: "scatter",
							mode: "lines",
							name: "Demodulated Signal",
							line: { color: "green", width: 1 },
							yaxis: "y2",
						},
					]}
					layout={{
						width: 1000,
						height: 400,
						title: "AM Demodulation with Dual Y-Axes",
						paper_bgcolor: "#f9fafb",
						plot_bgcolor: "#f9fafb",
						xaxis: { title: "Time (s)" },
						yaxis: {
							title: "Original Message Signal",
							titlefont: { color: "blue" },
							tickfont: { color: "blue" },
							side: "left",
						},
						yaxis2: {
							title: "Demodulated Signal",
							titlefont: { color: "green" },
							tickfont: { color: "green" },
							overlaying: "y",
							side: "right",
						},
						legend: { x: 0.05, y: 1 },
						grid: { rows: 1, columns: 1, pattern: "independent" },
					}}
				/>

				<div className="mt-4 bg-green-50 p-4 rounded-lg">
					<p>
						<strong>Observation:</strong> The dual y-axes allow us
						to compare the original message (blue, left axis) and
						the demodulated signal (green, right axis). The
						demodulated signal closely follows the original message,
						demonstrating successful recovery of the information.
						{modulationIndex > 1 && (
							<span className="text-red-600">
								{" "}
								Additional distortion is present due to
								overmodulation, which causes information loss
								during demodulation.
							</span>
						)}
					</p>
				</div>
			</section>

			{/* Additional Technical Details */}
			<section className="mb-8 bg-gray-50 p-6 rounded-lg shadow-sm">
				<h2 className="text-2xl font-bold mb-4 text-indigo-600">
					Technical Implementation Details
				</h2>

				<div className="mb-4">
					<h3 className="text-xl font-semibold mb-2">
						Amplitude Relationships
					</h3>
					<p className="mb-2">
						The key relationships in AM modulation are:
					</p>
					<ul className="list-disc pl-6 mb-2">
						<li>
							Message amplitude:{" "}
							<InlineMath math={`A_m = ${Am}`} />
						</li>
						<li>
							Carrier amplitude:{" "}
							<InlineMath math={`A_c = ${Ac}`} />
						</li>
						<li>
							Modulation index:{" "}
							<InlineMath
								math={`\\mu = \\frac{A_m}{A_c} = ${modulationIndex.toFixed(
									2
								)}`}
							/>
						</li>
						<li>
							Maximum envelope amplitude:{" "}
							<InlineMath
								math={`A_c + A_m = ${(Ac + Am).toFixed(1)}`}
							/>
						</li>
						<li>
							Minimum envelope amplitude:{" "}
							<InlineMath
								math={`A_c - A_m = ${(Ac - Am).toFixed(1)}`}
							/>
						</li>
					</ul>

					<h3 className="text-xl font-semibold mb-2">
						Bandwidth Considerations
					</h3>
					<p className="mb-2">
						The bandwidth of an AM signal is twice the highest
						frequency component in the message signal:
					</p>
					<BlockMath math="BW = 2f_m" />

					<p className="mb-2">
						With our message frequency{" "}
						<InlineMath math={`f_m = ${fm} Hz`} />, the bandwidth
						is:
					</p>
					<BlockMath math={`BW = 2 \\cdot ${fm} = ${2 * fm} Hz`} />

					<h3 className="text-xl font-semibold mb-2 mt-4">
						Power Efficiency
					</h3>
					<p className="mb-2">
						The power efficiency of AM depends on the modulation
						index:
					</p>
					<BlockMath
						math={`\\eta = \\frac{\\mu^2}{2 + \\mu^2} = \\frac{${modulationIndex.toFixed(
							2
						)}^2}{2 + ${modulationIndex.toFixed(2)}^2} = ${(
							(Math.pow(modulationIndex, 2) /
								(2 + Math.pow(modulationIndex, 2))) *
							100
						).toFixed(1)}\\%`}
					/>

					<h3 className="text-xl font-semibold mb-2 mt-4">
						Digital Filter Implementation
					</h3>
					<p className="mb-2">
						Our demodulation uses cascaded first-order digital
						filters:
					</p>
					<ul className="list-disc pl-6 mb-2">
						<li>
							3rd order low-pass filter for envelope smoothing
						</li>
						<li>
							Cutoff frequency at 1.5 × message frequency (750 Hz)
						</li>
						<li>Roll-off rate: 18 dB per octave</li>
						<li>
							Adaptive DC removal using moving mean estimation
						</li>
					</ul>
				</div>
			</section>
		</div>
	);
};

export default AMModulation;
