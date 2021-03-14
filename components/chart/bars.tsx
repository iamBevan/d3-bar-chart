import { max } from "d3-array"
import { easeElastic } from "d3-ease"
import { scaleBand, scaleLinear } from "d3-scale"
import { Selection } from "d3-selection"
import {
	Dispatch,
	FC,
	MutableRefObject,
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

export const Bars: FC<BarsProps> = ({ dimensions, data, selection }) => {
	const maxValue = max(data, d => d.units) as number

	/**
	 * another useEffect with data as its dependency
	 * runs everytime data changes so updates can be made to the chart
	 */
	useEffect(() => {
		const y = scaleLinear()
			.domain([0, maxValue])
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
