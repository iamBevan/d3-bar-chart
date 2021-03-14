import { axisBottom } from "d3-axis"
import { scaleBand } from "d3-scale"
import { Selection } from "d3-selection"
import { useEffect, FC } from "react"
import { Data } from "./chart"

interface XAxisProps {
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

export const XAxis: FC<XAxisProps> = ({
	selection,
	data,
	dimensions,
}): JSX.Element => {
	useEffect(() => {
		let x = scaleBand()
			.domain(data.map(d => d.name))
			.range([0, dimensions.chartWidth])
			.padding(0.05)

		if (selection) {
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
		}
	}, [
		data,
		dimensions.chartHeight,
		dimensions.chartWidth,
		dimensions.height,
		dimensions.marginLeft,
		selection,
	])

	useEffect(() => {
		/**
		 * xAxis group
		 */
		if (selection) {
			let x = scaleBand()
				.domain(data.map(d => d.name))
				.range([0, dimensions.chartWidth])
				.padding(0.05)
			const xAxis = axisBottom(x)

			const axisXSelection = selection.selectAll("#x")

			axisXSelection
				.transition()
				.style("opacity", 0)
				.duration(300)
				.remove()

			selection
				.append("g")
				.attr(
					"transform",
					`translate(${dimensions.marginLeft}, ${dimensions.chartHeight})`
				)
				.style("opacity", 0)
				.call(xAxis)
				.transition()
				.duration(300)
				.style("opacity", 1)
				.attr(
					"transform",
					`translate(${dimensions.marginLeft}, ${dimensions.chartHeight})`
				)
				.attr("id", "x")
		}
	}, [
		data,
		dimensions.chartHeight,
		dimensions.chartWidth,
		dimensions.marginLeft,
		selection,
	])
	return <>X Axis</>
}
