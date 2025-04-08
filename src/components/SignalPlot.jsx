import Plot from "react-plotly.js";

const SignalPlot = ({ title, x, y }) => {
	return (
		<div className="my-8">
			<h2 className="text-xl text-cyan-300 font-bold mb-2">{title}</h2>
			<Plot
				data={[
					{
						x,
						y,
						type: "scatter",
						mode: "lines",
						line: { color: "#06b6d4" },
					},
				]}
				layout={{
					autosize: true,
					margin: { l: 40, r: 30, b: 40, t: 30 },
					paper_bgcolor: "#0f172a",
					plot_bgcolor: "#1e293b",
					font: { color: "white" },
				}}
				useResizeHandler
				style={{ width: "100%", height: "400px" }}
			/>
		</div>
	);
};

export default SignalPlot;
