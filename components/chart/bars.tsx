import { max, maxIndex } from "d3-array"
import { easeElastic } from "d3-ease"
import { scaleBand, scaleLinear } from "d3-scale"
import { select, Selection } from "d3-selection"
import React, {
	Dispatch,
	FC,
	MutableRefObject,
	Ref,
	SetStateAction,
	useEffect,
} from "react"
import { Data } from "./chart"

interface BarsProps {
	selection: null | Selection<SVGSVGElement | null, unknown, null, undefined>
	data: Data[]
	dimensions: {
		width: number
		height: number
		chartWidth: number
		chartHeight: number
		marginLeft: number
		marginBottom: number
	}
}

const Bars: FC<BarsProps> = ({ data, dimensions, selection }) => {
	const maxValue = max(data, d => d.units)

	useEffect(() => {
		let y = scaleLinear()
			.domain([0, maxValue as number])
			.range([dimensions.height, 0])

		let x = scaleBand()
			.domain(data.map(d => d.name))
			.range([0, dimensions.chartWidth])
			.padding(0.05)

		if (selection) {
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
			.domain([0, maxValue as number])
			.range([dimensions.chartHeight, 0])

		const x = scaleBand()
			.domain(data.map(d => d.name))
			.range([0, dimensions.chartWidth])
			.padding(0.05)

		if (selection) {
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
	}, [
		data,
		dimensions.chartHeight,
		dimensions.chartWidth,
		dimensions.height,
		dimensions.marginBottom,
		maxValue,
		selection,
	])
	return <>Bars</>
}

export default Bars
