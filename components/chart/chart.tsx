import { max, scaleBand, scaleLinear, select, Selection } from "d3"
import { useEffect, useRef, useState } from "react"
import randomstring from "randomstring"
import { XAxis } from "./xAxis"
import { YAxis } from "./yAxis"
import { Bars } from "./bars"

export type Data = {
	units: number
	color: string
	name: string
}

let initialData: Data[] = [
	{
		name: "foo",
		units: 32,
		color: "red",
	},
	{
		name: "bar",
		units: 67,
		color: "green",
	},
	{
		name: "baz",
		units: 81,
		color: "blue",
	},
	{
		name: "hoge",
		units: 38,
		color: "pink",
	},
	{
		name: "piyo",
		units: 28,
		color: "purple",
	},
	{
		name: "hogera",
		units: 59,
		color: "cyan",
	},
]
export const Chart: React.FC = () => {
	const dimensions = {
		width: 800,
		height: 450,
		chartWidth: 700,
		chartHeight: 350,
		marginLeft: 100,
		marginBottom: 100,
	}
	const svgRef = useRef<SVGSVGElement | null>(null)
	const [data, setData] = useState<Data[]>(initialData)
	const [selection, setSelection] = useState<null | Selection<
		SVGSVGElement | null,
		unknown,
		null,
		undefined
	>>(null)

	const maxValue = max(data, d => d.units) as number

	useEffect(() => {
		let y = scaleLinear()
			.domain([0, maxValue])
			.range([dimensions.height, 0])

		let x = scaleBand()
			.domain(data.map(d => d.name))
			.range([0, dimensions.chartWidth])
			.padding(0.05)
		if (!selection) {
			setSelection(select(svgRef.current))
		} else {
			/**
			 * Bars - rects inside g
			 */
			selection
				.append("g")
				.attr("height", dimensions.chartHeight)
				.attr("width", 100)
				.attr("id", "chart-container")
				.attr("transform", `translate(${dimensions.marginLeft}, 0)`)
				.selectAll("rect")
				.data(data)
				.enter()
				.append("rect")
				.attr("x", d => x(d.name) ?? null)
				.attr("y", d => y(d.units))
				.attr("fill", d => d.color)
				.attr("width", x.bandwidth())
				.attr("height", d => dimensions.chartHeight - y(d.units))
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selection])

	function getRandomColor(): string {
		let letters = "0123456789ABCDEF"
		let color = "#"
		for (let i = 0; i < 6; i++) {
			color += letters[Math.floor(Math.random() * 16)]
		}
		return color
	}

	const addRandom = (): void => {
		const dataToBeAdded = {
			name: randomstring.generate(4),
			units: Math.floor(Math.random() * 99),
			color: getRandomColor(),
		}

		setData([...data, dataToBeAdded])
	}

	const removeLast = (): void => {
		if (data.length === 0) {
			return
		} else {
			const slicedData = data.slice(0, data.length - 1)
			setData(slicedData)
		}
	}

	return (
		<>
			<svg
				ref={svgRef}
				width={dimensions.width}
				height={dimensions.height}
			>
				<XAxis
					data={data}
					dimensions={dimensions}
					selection={selection}
				/>
				<YAxis
					data={data}
					dimensions={dimensions}
					selection={selection}
				/>
				<Bars
					data={data}
					dimensions={dimensions}
					selection={selection}
					setSelection={setSelection}
					svgRef={svgRef}
				/>
			</svg>
			<button onClick={addRandom}>+</button>
			<button onClick={removeLast}>-</button>
		</>
	)
}
