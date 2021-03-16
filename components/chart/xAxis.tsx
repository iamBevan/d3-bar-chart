import { axisBottom } from "d3-axis"
import { scaleBand } from "d3-scale"
import { Selection } from "d3-selection"
import { useEffect, FC } from "react"
import { useFirstMountState } from "react-use"
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
	const isFirstMount = useFirstMountState()

	useEffect(() => {
		let x = scaleBand()
			.domain(data.map(d => d.name))
			.range([0, dimensions.chartWidth])
			.padding(0.05)

		if (selection && isFirstMount) {
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
				.selectAll("text")
				.style("text-anchor", "end")
				.attr("dx", "-.8em")
				.attr("dy", ".15em")
				.attr("transform", "rotate(-65)")
		}
	}, [
		data,
		dimensions.chartHeight,
		dimensions.chartWidth,
		dimensions.height,
		dimensions.marginLeft,
		isFirstMount,
		selection,
	])

	useEffect(() => {
		/**
		 * xAxis group
		 */
		if (selection && !isFirstMount) {
			let x = scaleBand()
				.domain(data.map(d => d.name))
				.range([0, dimensions.chartWidth])
				.padding(0.05)
			const xAxis = axisBottom(x)

			const axisXSelection = selection.selectAll("#x")

			axisXSelection.transition().style("opacity", 0).delay(300).remove()

			selection
				.append("g")
				.call(xAxis)
				.style("opacity", 0)
				.attr(
					"transform",
					`translate(${dimensions.marginLeft}, ${dimensions.chartHeight})`
				)
				.transition()
				.delay(300)
				.style("opacity", 1)
				.attr("height", dimensions.height - dimensions.chartHeight)
				.attr("id", "x")
				.selectAll("text")
				.style("text-anchor", "end")
				.attr("dx", "-.8em")
				.attr("dy", ".15em")
				.attr("transform", "rotate(-65)")
		}
	}, [
		data,
		dimensions.chartHeight,
		dimensions.chartWidth,
		dimensions.height,
		dimensions.marginLeft,
		isFirstMount,
		selection,
	])
	return <>X Axis</>
}
