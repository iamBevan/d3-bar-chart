/* eslint-disable react-hooks/exhaustive-deps */
import { max } from "d3-array"
import { axisLeft } from "d3-axis"
import { scaleLinear } from "d3-scale"
import { Selection } from "d3-selection"
import { FC, useEffect } from "react"
import { Data } from "./chart"

interface YAxisProps {
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

export const YAxis: FC<YAxisProps> = ({
	selection,
	data,
	dimensions,
}): JSX.Element => {
	useEffect(() => {
		const maxValue = max(data, d => d.units) as number

		if (selection) {
			const y = scaleLinear()
				.domain([0, maxValue])
				.range([dimensions.chartHeight, 0])

			const yAxis = axisLeft(y).tickFormat(t => `${t as number}u`)
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
		}
	}, [
		dimensions.chartHeight,
		dimensions.marginBottom,
		dimensions.marginLeft,
		selection,
	])
	useEffect(() => {
		const maxValue = max(data, d => d.units) as number

		if (selection) {
			const y = scaleLinear()
				.domain([0, maxValue])
				.range([dimensions.chartHeight, 0])

			const yAxis = axisLeft(y).tickFormat(t => `${t as number}u`)

			const axisYSelection = selection.selectAll("#y")

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
				.attr("transform", `translate(${dimensions.marginLeft}, ${0})`)
				.style("opacity", 0)
				.call(yAxis)
				.transition()
				.duration(300)
				.style("opacity", 1)
				.attr("transform", `translate(${dimensions.marginLeft}, ${0})`)
				.attr("id", "y")
		}
	}, [data, dimensions.chartHeight, dimensions.marginLeft, selection])
	return <>Y Axis</>
}
