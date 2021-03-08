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

const initialData: Data[] = [
	{ units: 2150, color: "orange", name: "Cats" },
	{ units: 4450, color: "blue", name: "Dogs" },
	{ units: 5900, color: "red", name: "Snakes" },
	{ units: 7590, color: "green", name: "Pigs" },
	{ units: 1200, color: "purple", name: "Wolves" },
	{ units: 8000, color: "pink", name: "Cows" },
	{ units: 9000, color: "cyan", name: "Lizards" },
	{ units: 5600, color: "cyan", name: "Bears" },
]

const dimensions = {
	width: 800,
	height: 450,
	chartWidth: 700,
	chartHeight: 350,
	marginLeft: 100,
}

export const Chart = (): JSX.Element => {
	const svgRef = useRef<SVGSVGElement | null>(null)
	const [selection, setSelection] = useState<null | Selection<
		SVGSVGElement | null,
		unknown,
		null,
		undefined
	>>(null)
	const [data, setData] = useState(initialData)

	const maxValue = max(data, d => d.units)

	let y = scaleLinear()
		.domain([0, maxValue as NumberValue])
		.range([dimensions.chartHeight, 0])

	let x = scaleBand()
		.domain(data.map(d => d.name))
		.range([0, dimensions.chartWidth])
		.paddingInner(0.05)

	const yAxis = axisLeft(y)
		.ticks(5)
		.tickFormat(t => `${t as number}u`)
	const xAxis = axisBottom(x).ticks(5)

	useEffect(() => {
		if (!selection) {
			setSelection(select(svgRef.current))
		} else {
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
				.attr("z-index", 1000)
				.attr("fill", "salmon")

			/**
			 * yAxis group
			 */
			selection
				.append("g")
				.call(yAxis)
				.attr("transform", `translate(${dimensions.marginLeft}, 0)`)

			/**
			 * Bars - rects inside g
			 */
			selection
				.append("g")
				.attr("id", "chart")
				.attr("transform", `translate(${dimensions.marginLeft}, 0)`)
				.selectAll("rect")
				.data(data)
				.enter()
				.append("rect")
				.attr("width", x.bandwidth())
				.attr("height", 0)
				.attr("fill", d => d.color)
				.attr("x", d => x(d.name) ?? null)
				.attr("y", dimensions.chartHeight)
				.transition()
				.ease(easeLinear)
				.duration(300)
				.delay((_, i) => i * 100)
				.attr("height", d => dimensions.chartHeight - y(d.units))
				.attr("y", d => y(d.units))
		}
		return () => {
			if (selection) {
				selection.selectAll("g").remove().exit()
				selection.selectAll("rect").remove().exit()
			}
		}
	}, [selection])

	useEffect(() => {
		if (selection) {
			// eslint-disable-next-line react-hooks/exhaustive-deps
			y = scaleLinear()
				.domain([0, maxValue as NumberValue])
				.range([0, dimensions.chartHeight])

			// eslint-disable-next-line react-hooks/exhaustive-deps
			x = scaleBand()
				.domain(data.map(d => d.name))
				.range([0, dimensions.chartWidth])
				.paddingInner(0.05)

			const rects = selection
				.selectAll("chart")
				.selectAll("rect")
				.data(data)

			rects
				.exit()
				.transition()
				.ease(easeElastic)
				.duration(400)
				.attr("height", 0)
				.attr("y", dimensions.height)
				.remove()

			rects
				.transition()
				.duration(300)
				.attr("width", x.bandwidth())
				.attr("height", d => y(d.units))
				.attr("fill", d => d.color)
				.attr("x", d => x(d.name) ?? null)

			rects
				.enter()
				.append("rect")
				.attr("x", d => x(d.name) ?? null)
				.attr("width", x.bandwidth())
				.attr("height", d => dimensions.chartHeight - y(d.units))
				.attr("y", dimensions.chartHeight)
				.transition()
				.delay(400)
				.duration(500)
				.ease(easeElastic)
				.attr("height", d => dimensions.chartHeight - y(d.units))
				.attr("y", d => y(d.units))
				.attr("fill", d => d.color)
		}

		return () => {
			if (selection) {
				selection
					.selectAll("chart")
					.selectAll("rect")
					.data(data)
					.exit()
					.remove()
			}
		}
	}, [data])

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
			name: randomstring.generate(10),
			units: Math.floor(Math.random() * 9999),
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
