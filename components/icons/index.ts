export * from "./icons"

export interface IconProps {
	/**
	 * The size of the icon. Defaults to 16.
	 */
	size?: number
	/**
	 * The color to set the icon to. Note that this does not work reliably for pre-coloured icons.
	 */

	color?: string
	/**
	 * The class name to be passed down to the svg element.
	 */

	className?: string
}
