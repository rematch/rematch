import ClipboardJS from 'clipboard'

export default (function () {
	return {
		onRouteUpdate() {
			window.setTimeout(() => {
				const button = () => {
					const btn = document.createElement('button')
					btn.classList.add('copy-button')
					btn.setAttribute('type', 'button')
					btn.setAttribute('aria-label', 'Copy code to clipboard')
					btn.innerText = 'Copy'
					return btn
				}

				const nodes = document.querySelectorAll('pre.shiki')
				for (let i = 0; i < nodes.length; i += 1) {
					const node = nodes[i]
					node.appendChild(button())
				}

				const clipboard = new ClipboardJS('.copy-button', {
					target(trigger) {
						return trigger.parentNode.querySelector('code')
					},
				})

				clipboard.on('success', (event) => {
					event.clearSelection()
					const el = event.trigger
					el.textContent = 'Copied'
					setTimeout(() => {
						el.textContent = 'Copy'
					}, 2000)
				})
			}, 150)
		},
	}
})()
