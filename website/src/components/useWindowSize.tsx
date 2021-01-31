import { useState, useEffect } from 'react'
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment'

function getWindowDimensions() {
	const { innerWidth: width, innerHeight: height } =
		ExecutionEnvironment.canUseDOM && window
	return {
		width,
		height,
	}
}

export default function useWindowDimensions() {
	const [windowDimensions, setWindowDimensions] = useState(
		getWindowDimensions()
	)

	useEffect(() => {
		function handleResize() {
			setWindowDimensions(getWindowDimensions())
		}

		if (ExecutionEnvironment.canUseEventListeners) {
			window.addEventListener('resize', handleResize)
		}

		return () => {
			if (ExecutionEnvironment.canUseEventListeners) {
				window.removeEventListener('resize', handleResize)
			}
		}
	}, [])

	return windowDimensions
}
