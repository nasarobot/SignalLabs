// FMModulation.jsx
import {React, useState} from "react";
import { InlineMath, BlockMath } from "react-katex";
import Plot from "react-plotly.js";
import { computeFMModulation } from "../../lib/fmmodulation";
import { computeFMDemodulation } from "../../lib/fmdemodulation";
import { computeFFT } from "../../lib/computeFFT";


const FMModulation = () => {
	// Interactive state parameters
	const [beta, setBeta] = useState(5);
	const [fc, setFc] = useState(10000);
	const [fm, setFm] = useState(500);
	const [fftSize, setFftSize] = useState(8192);
	const [bpLowCutoff, setBpLowCutoff] = useState(() => fc - 2 * fm); // e.g., default: fc - 2fm
	const [bpHighCutoff, setBpHighCutoff] = useState(() => fc + 2 * fm); // e.g., default: fc + 2fm
	const [filterCutoff, setFilterCutoff] = useState(3.0); // times fm
	const [filterOrder, setFilterOrder] = useState(2);

	// Fixed parameters
	const fs = 500000;
	const duration = 0.02;

	const { t, message, modulated } = computeFMModulation(
		fs,
		duration,
		fc,
		fm,
		beta,
	);
	// const fftsize = 8192;
	const { frequencies, magnitudes } = computeFFT(modulated, fs, fftSize);
	const demodulated = computeFMDemodulation(
		modulated,
		fs,
		fc,
		fm,
		beta,
		bpLowCutoff,
		bpHighCutoff,
		filterCutoff,
		filterOrder
	);

	return (
		<div className="p-4 max-w-6xl mx-auto">
			<h1 className="text-3xl font-bold mb-6 text-indigo-600 text-center">
				Frequency Modulation and Demodulation
			</h1>

			{/* FM Modulation Theory */}
			<section className="mb-8 bg-gray-50 p-6 rounded-lg shadow-sm">
				<h2 className="text-2xl font-bold mb-4 text-indigo-600">
					FM Modulation Theory
				</h2>

				<div className="mb-4">
					<p className="mb-2">
						Frequency Modulation (FM) is a modulation technique
						where the frequency of the carrier signal varies in
						proportion to the message signal, while the amplitude
						remains constant.
					</p>

					<p className="mb-2">
						The instantaneous frequency <InlineMath math="f_i(t)" />{" "}
						of the FM signal is given by:
					</p>
					<BlockMath math="f_i(t) = f_c + k_f \cdot m(t)" />

					<p className="mb-2">
						The FM modulated signal <InlineMath math="s_{FM}(t)" />{" "}
						is expressed as:
					</p>
					<BlockMath math="s_{FM}(t) = A_c \cos\left(2\pi f_c t + 2\pi k_f \int_{0}^{t} m(\tau) d\tau\right)" />

					<p className="mb-2">
						In our implementation, we use a sinusoidal message
						signal <InlineMath math="m(t) = \sin(2\pi f_m t)" />{" "}
						with:
					</p>
					<ul className="list-disc pl-6 mb-2">
						<li>
							Carrier frequency{" "}
							<InlineMath math="f_c = 10,000 Hz" />
						</li>
						<li>
							Message frequency <InlineMath math="f_m = 500 Hz" />
						</li>
						<li>
							Modulation index <InlineMath math="\beta = 5" />
						</li>
						<li>
							Frequency sensitivity{" "}
							<InlineMath math="k_f = 2\pi\beta f_m" />
						</li>
					</ul>
				</div>
			</section>

			<section className="mb-6 bg-blue-50 p-4 rounded-lg shadow-sm border border-blue-200">
				<h2 className="text-xl font-bold mb-3 text-indigo-600">
					FM Modulation Parameters
				</h2>
				<div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-2">
					<div className="bg-white p-3 rounded-lg shadow-sm">
						<label className="block text-xs font-semibold mb-1 text-gray-700">
							β (Modulation Index): {beta.toFixed(2)}
						</label>
						<input
							type="range"
							min="0.1"
							max="10"
							step="0.1"
							value={beta}
							onChange={e => setBeta(parseFloat(e.target.value))}
							className="w-full h-1 bg-blue-200 rounded-lg appearance-none cursor-pointer"
						/>
					</div>
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
					<div className="bg-white p-3 rounded-lg shadow-sm">
						<label className="block text-xs font-semibold mb-1 text-gray-700">
							fm: {fm}Hz
						</label>
						<input
							type="range"
							min="100"
							max="2000"
							step="50"
							value={fm}
							onChange={e => setFm(parseInt(e.target.value))}
							className="w-full h-1 bg-blue-200 rounded-lg appearance-none cursor-pointer"
						/>
					</div>
					<div className="bg-white p-3 rounded-lg shadow-sm">
						<label className="block text-xs font-semibold mb-1 text-gray-700">
							FFT Size
						</label>
						<select
							value={fftSize}
							onChange={e => setFftSize(parseInt(e.target.value))}
							className="w-full text-xs border rounded">
							<option value={1024}>1024</option>
							<option value={2048}>2048</option>
							<option value={4096}>4096</option>
							<option value={8192}>8192</option>
							<option value={16384}>16384</option>
						</select>
					</div>
					<div className="flex flex-col justify-between bg-white p-3 rounded-lg shadow-sm">
						<div className="text-xs text-gray-600 font-medium">
							BW (Carson): {(2 * (beta + 1) * fm).toFixed(0)} Hz
						</div>
						<div className="text-xs text-gray-600 font-medium">
							Δf: {(beta * fm).toFixed(0)} Hz
						</div>
					</div>
				</div>
			</section>

			{/* FM Modulation Plot */}
			<section className="mb-8">
				<h2 className="text-2xl font-bold mb-4 text-indigo-600">
					FM Modulation Visualization
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
							name: "FM Signal",
							line: { color: "red", width: 1 },
						},
					]}
					layout={{
						width: 1000,
						height: 400,
						title: "FM Modulation - Time Domain",
						paper_bgcolor: "#f9fafb",
						plot_bgcolor: "#f9fafb",
						xaxis: { title: "Time (s)" },
						yaxis: { title: "Amplitude" },
					}}
				/>

				<div className="mt-4 bg-blue-50 p-4 rounded-lg">
					<p>
						<strong>Observation:</strong> Notice how the frequency
						of the red FM signal increases when the blue message
						signal is positive, and decreases when the message
						signal is negative. The amplitude of the FM signal
						remains constant throughout.
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
						title: "FM Modulation - Frequency Domain",
						paper_bgcolor: "#f9fafb",
						plot_bgcolor: "#f9fafb",
						xaxis: {
							title: "Frequency (Hz)",
							range: [0, 2 * fc],
						},
						yaxis: {
							title: "Magnitude",
							type: "log",
						},
					}}
				/>
			</section>

			{/* FM Demodulation Theory */}
			<section className="mb-8 bg-gray-50 p-6 rounded-lg shadow-sm">
				<h2 className="text-2xl font-bold mb-4 text-indigo-600">
					FM Demodulation Theory
				</h2>

				<div className="mb-4">
					<p className="mb-2">
						FM demodulation recovers the original message signal
						from the modulated FM signal. Our implementation uses a
						discrete differentiation approach followed by envelope
						detection.
					</p>

					<p className="mb-2">
						The derivative of the FM signal contains the message
						information:
					</p>
					<BlockMath math="\frac{d}{dt}[\cos(2\pi f_c t + \phi(t))] \approx -\sin(2\pi f_c t + \phi(t)) \cdot (2\pi f_c + \frac{d\phi(t)}{dt})" />

					<p className="mb-2">
						Since{" "}
						<InlineMath math="\frac{d\phi(t)}{dt} = k_f \cdot m(t)" />
						, the envelope of this differentiated signal contains
						our message.
					</p>

					<p className="mb-2">Our demodulation process involves:</p>
					<ol className="list-decimal pl-6 mb-2">
						<li>Bandpass filtering to isolate the FM signal</li>
						<li>
							Discrete differentiation using sample-to-sample
							differences
						</li>
						<li>
							Envelope detection using a moving average window
						</li>
						<li>
							DC component removal with a larger window moving
							average
						</li>
						<li>
							Low-pass filtering to smooth the recovered signal
						</li>
					</ol>
				</div>
			</section>

			<section className="mb-6 bg-yellow-50 p-4 rounded-lg shadow-sm border border-yellow-200">
				<h3 className="text-xl font-bold mb-3 text-amber-700">
					Demodulation Filter Configuration
				</h3>
				<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
					{/* Bandpass Low Cutoff */}
					<div className="bg-white p-3 rounded-lg shadow-sm">
						<label className="block text-sm font-semibold mb-2 text-gray-700">
							BP Low Cutoff: {bpLowCutoff} Hz
						</label>
						<input
							type="range"
							min={Math.max(0, fc - 5 * fm)}
							max={fc}
							step={100}
							value={bpLowCutoff}
							onChange={e =>
								setBpLowCutoff(parseInt(e.target.value))
							}
							className="w-full h-1 bg-blue-200 rounded-lg appearance-none cursor-pointer"
						/>
					</div>
					{/* Bandpass High Cutoff */}
					<div className="bg-white p-3 rounded-lg shadow-sm">
						<label className="block text-sm font-semibold mb-2 text-gray-700">
							BP High Cutoff: {bpHighCutoff} Hz
						</label>
						<input
							type="range"
							min={fc}
							max={fc + 5 * fm}
							step={100}
							value={bpHighCutoff}
							onChange={e =>
								setBpHighCutoff(parseInt(e.target.value))
							}
							className="w-full h-1 bg-blue-200 rounded-lg appearance-none cursor-pointer"
						/>
					</div>
					{/* Low-pass Cutoff */}
					<div className="bg-white p-3 rounded-lg shadow-sm">
						<label className="block text-sm font-semibold mb-2 text-gray-700">
							Low-pass Cutoff: {filterCutoff} × fm ={" "}
							{(filterCutoff * fm).toFixed(0)} Hz
						</label>
						<input
							type="range"
							min="1"
							max="5"
							step="0.1"
							value={filterCutoff}
							onChange={e =>
								setFilterCutoff(parseFloat(e.target.value))
							}
							className="w-full h-1 bg-blue-200 rounded-lg appearance-none cursor-pointer"
						/>
					</div>
					{/* Filter Order */}
					<div className="bg-white p-3 rounded-lg shadow-sm">
						<label className="block text-sm font-semibold mb-2 text-gray-700">
							LPF Order: {filterOrder}
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
					</div>
				</div>
				{/* Optionally, a note or calculated summary */}
				<div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-xs">
					<p className="text-blue-700">
						<strong>Tip:</strong> The bandpass filter selects the
						range around your carrier frequency ({fc} Hz). Adjust
						its lower and upper cutoffs to include your FM signal
						while rejecting out-of-band noise. The low-pass filter
						controls smoothing and noise rejection of the recovered
						message.
					</p>
				</div>
			</section>

			{/* FM Demodulation Plot */}
			<section className="mb-8">
				<h2 className="text-2xl font-bold mb-4 text-indigo-600">
					FM Demodulation Visualization
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
						title: "FM Demodulation with Dual Y-Axes",
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
						the demodulated signal (green, right axis) despite their
						different amplitude scales. Note how the waveforms match
						in phase and frequency, confirming successful
						demodulation.
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
						Bandwidth Considerations
					</h3>
					<p className="mb-2">
						According to Carson's rule, the bandwidth of an FM
						signal is approximately:
					</p>
					<BlockMath math="BW \approx 2(\beta + 1)f_m" />

					<p className="mb-2">
						With our parameters <InlineMath math="\beta = 5" /> and{" "}
						<InlineMath math="f_m = 500 Hz" />, the bandwidth is:
					</p>
					<BlockMath math="BW \approx 2(5 + 1) \cdot 500 = 6000 Hz" />

					<h3 className="text-xl font-semibold mb-2 mt-4">
						Demodulation Challenges
					</h3>
					<p className="mb-2">
						Digital FM demodulation faces several challenges:
					</p>
					<ul className="list-disc pl-6 mb-2">
						<li>
							Discrete differentiation amplifies high-frequency
							noise
						</li>
						<li>
							Moving average window size affects the quality of
							envelope detection
						</li>
						<li>DC offset can mask the true message signal</li>
					</ul>
					<p className="mb-2">
						Our implementation addresses these challenges through
						bandpass filtering, optimized window sizes, DC component
						removal, and final smoothing.
					</p>
				</div>
			</section>
		</div>
	);
};

export default FMModulation;
