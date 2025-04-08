// AMModulation.jsx
import React from "react";
import { InlineMath, BlockMath } from "react-katex";
import Plot from "react-plotly.js";
import { computeAMModulation } from "../../lib/ammodulation";
import { computeAMDemodulation } from "../../lib/amdemodulation";
import { computeFFT } from "../../lib/computeFFT";

const AMModulation = () => {
	const fs = 500000;
	const duration = 0.02;
	const fc = 10000;
	const fm = 500;
	const modulationIndex = 0.8;

	const { t, message, modulated } = computeAMModulation(
		fs,
		duration,
		fc,
		fm,
		modulationIndex
	);
	const fftsize = 8192;
	const { frequencies, magnitudes } = computeFFT(modulated, fs, fftsize);
	const demodulated = computeAMDemodulation(modulated, fs, fc, fm);

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
					<BlockMath math="s_{AM}(t) = A_c [1 + \mu \cdot m(t)] \cos(2\pi f_c t)" />

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
							Modulation index <InlineMath math="\mu = 0.8" />
						</li>
					</ul>

					<p className="mb-2">
						The modulation index <InlineMath math="\mu" /> must be
						between 0 and 1 to prevent overmodulation, which causes
						distortion.
					</p>
				</div>
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
						title: "AM Modulation - Time Domain",
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
							range: [0, 2*fc],
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
						shows the carrier frequency at 10,000 Hz and two
						sidebands at fc-fm (9,500 Hz) and fc+fm (10,500 Hz).
						This is characteristic of AM modulation, where the
						bandwidth is twice the message frequency.
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
							Rectification (taking the absolute value of the AM
							signal)
						</li>
						<li>
							Envelope extraction using a moving average window
						</li>
						<li>
							DC component removal using a larger window moving
							average
						</li>
					</ol>

					<p className="mb-2">
						Mathematically, we're extracting the envelope of:
					</p>
					<BlockMath math="s_{AM}(t) = A_c [1 + \mu \cdot m(t)] \cos(2\pi f_c t)" />

					<p className="mb-2">
						Which gives us{" "}
						<InlineMath math="A_c [1 + \mu \cdot m(t)]" />. After
						removing the DC component <InlineMath math="A_c" />, we
						get <InlineMath math="A_c \cdot \mu \cdot m(t)" />,
						which is proportional to our original message.
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
					{" "}
					<p>
						{" "}
						<strong>Observation:</strong> The dual y-axes allow us
						to compare the original message (blue, left axis) and
						the demodulated signal (green, right axis). The
						demodulated signal closely follows the original message,
						demonstrating successful recovery of the information.
						Some distortion visible in the demodulated signal is due
						to the 2nd order Butterworth filter used in our
						implementation which has a gently rolloff. This
						relatively gentle roll-off characteristic means the
						filter attenuates frequencies outside the passband more
						gradually than higher-order filters would, resulting in
						some residual high-frequency components that cause
						slight distortion in the recovered signal. The trade-off
						is that the 2nd order filter provides a maximally flat
						response in the passband with minimal phase distortion.{" "}
					</p>{" "}
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
						The bandwidth of an AM signal is twice the highest
						frequency component in the message signal:
					</p>
					<BlockMath math="BW = 2f_m" />

					<p className="mb-2">
						With our message frequency{" "}
						<InlineMath math="f_m = 500 Hz" />, the bandwidth is:
					</p>
					<BlockMath math="BW = 2 \cdot 500 = 1000 Hz" />

					<p className="mb-2">
						This is significantly narrower than the FM bandwidth,
						which is one of the advantages of AM in terms of
						spectrum efficiency.
					</p>

					<h3 className="text-xl font-semibold mb-2 mt-4">
						Power Efficiency
					</h3>
					<p className="mb-2">
						AM is less power-efficient than FM because:
					</p>
					<ul className="list-disc pl-6 mb-2">
						<li>
							The carrier component contains no information but
							consumes most of the power
						</li>
						<li>
							Only the sidebands contain the actual message
							information
						</li>
						<li>
							With modulation index μ = 0.8, only about 33% of the
							power is in the sidebands
						</li>
					</ul>

					<h3 className="text-xl font-semibold mb-2 mt-4">
						Noise Susceptibility
					</h3>
					<p className="mb-2">
						AM is more susceptible to noise than FM because noise
						typically affects amplitude more than frequency. This is
						why FM is preferred for high-fidelity applications like
						music broadcasting.
					</p>
				</div>
			</section>
		</div>
	);
};

export default AMModulation;
