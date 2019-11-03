import { init } from '@rematch/core'
import { reactNavigationPlugin } from './navigator'

const store = init({
	models: {},
	plugins: [reactNavigationPlugin],
})

export default store
