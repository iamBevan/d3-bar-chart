import { select, Selection } from "d3"
import { useEffect, useRef, useState } from "react"
import randomstring from "randomstring"
import { XAxis } from "./xAxis"
import { YAxis } from "./yAxis"
import Bars from "./bars"

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

	useEffect(() => {
		setSelection(select(svgRef.current))
	}, [])

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
			{console.log("selection", selection)}
			<svg
				ref={svgRef}
				width={dimensions.width}
				height={dimensions.height}
			>
				{selection ? (
					<>
						<Bars
							data={data}
							dimensions={dimensions}
							selection={selection}
						/>
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
					</>
				) : (
					<h1>Hello</h1>
				)}
			</svg>
			<button onClick={addRandom}>+</button>
			<button onClick={removeLast}>-</button>
		</>
	)
}
