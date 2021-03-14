import {
	max,
	axisBottom,
	axisLeft,
	NumberValue,
	scaleBand,
	scaleLinear,
	select,
	selectAll,
	Selection,
	easeLinear,
	easeElastic,
} from "d3"
import { useEffect, useRef, useState } from "react"
import randomstring from "randomstring"

type Data = {
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

	const maxValue = max(data, d => d.units)

	const [selection, setSelection] = useState<null | Selection<
		SVGSVGElement | null,
		unknown,
		null,
		undefined
	>>(null)

	useEffect(() => {
		let y = scaleLinear()
			.domain([0, maxValue as NumberValue])
			.range([dimensions.height, 0])

		let x = scaleBand()
			.domain(data.map(d => d.name))
			.range([0, dimensions.chartWidth])
			.padding(0.05)
		if (!selection) {
			setSelection(select(svgRef.current))
		} else {
			const yAxis = axisLeft(y).tickFormat(t => `${t as number}u`)
			const xAxis = axisBottom(x)
			/**
			 * xAxis group
			 */
			selection
				.append("g")
				.call(xAxis)
				.attr(
					"transform",
					`translate(${dimensions.marginLeft}, ${dimensions.chartHeight})`
				)
				.attr("height", dimensions.height - dimensions.chartHeight)
				.attr("id", "x")

			/**
			 * yAxis group
			 */
			selection
				.append("g")
				.call(yAxis)
				.attr(
					"transform",
					`translate(${
						dimensions.marginLeft
					}, ${-dimensions.marginBottom})`
				)
				.attr("id", "y")
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

	/**
	 * another useEffect with data as its dependency
	 * runs everytime data changes so updates can be made to the chart
	 */
	useEffect(() => {
		const y = scaleLinear()
			.domain([0, maxValue as NumberValue])
			.range([dimensions.chartHeight, 0])

		const x = scaleBand()
			.domain(data.map(d => d.name))
			.range([0, dimensions.chartWidth])
			.padding(0.05)
		if (selection) {
			console.log("dog")

			const yAxis = axisLeft(y).tickFormat(t => `${t as number}u`)
			const xAxis = axisBottom(x)
			// eslint-disable-next-line react-hooks/exhaustive-deps

			const axisYSelection = selection.selectAll("#y")
			const axisXSelection = selection.selectAll("#x")

			axisXSelection
				.transition()
				// .attr(
				// 	"transform",
				// 	`translate(${dimensions.marginLeft}, ${dimensions.chartHeight})`
				// )
				// .attr("transition", "opacity 2s")
				// .attr("opacity", 0)
				.style("opacity", 0)
				// .ease(easeElastic)
				.duration(300)
				.remove()

			axisYSelection
				.transition()
				.style("opacity", 0)
				.duration(300)
				.remove()

			/**
			 * yAxis group
			 */
			selection
				.append("g")
				// .attr("transform", `translate(${dimensions.marginLeft}, ${0})`)
				.attr("transform", `translate(${dimensions.marginLeft}, ${0})`)
				.style("opacity", 0)
				.call(yAxis)
				.transition()
				// .ease(easeElastic)
				.duration(300)
				.style("opacity", 1)
				.attr("transform", `translate(${dimensions.marginLeft}, ${0})`)
				.attr("id", "y")

			/**
			 * xAxis group
			 */
			selection
				.append("g")
				.attr(
					"transform",
					`translate(${dimensions.marginLeft}, ${dimensions.chartHeight})`
				)
				.style("opacity", 0)
				.call(xAxis)
				.transition()
				// .ease(easeElastic)
				.duration(300)
				.style("opacity", 1)
				.attr(
					"transform",
					`translate(${dimensions.marginLeft}, ${dimensions.chartHeight})`
				)
				.attr("id", "x")

			const rects = selection
				.select("#chart-container")
				.selectAll("rect")
				.data(data)

			rects
				.exit()
				.transition()
				.ease(easeElastic)
				.duration(400)
				.attr("height", 0)
				.attr("y", dimensions.chartHeight)
				.remove()

			rects
				.transition()
				.delay(300)
				.attr("x", d => x(d.name) ?? null)
				.attr("y", d => y(d.units))
				.attr("width", x.bandwidth())
				.attr("height", d => dimensions.chartHeight - y(d.units))
				.attr("fill", d => d.color)

			rects
				.enter()
				.append("rect")
				.attr("x", d => x(d.name) ?? null)
				.attr("width", x.bandwidth())
				.attr("height", 0)
				.attr("y", dimensions.chartHeight)
				.transition()
				.delay(400)
				.duration(500)
				.ease(easeElastic)
				.attr("height", d => dimensions.height - y(d.units))
				.attr("y", d => y(d.units) - dimensions.marginBottom)
				.attr("fill", d => d.color)
		}
		console.log(data)
	}, [
		data,
		dimensions.chartHeight,
		dimensions.height,
		dimensions.marginBottom,
		dimensions.marginLeft,
		dimensions.width,
		maxValue,
		selection,
	])

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
			/>
			<button onClick={addRandom}>+</button>
			<button onClick={removeLast}>-</button>
		</>
	)
}
