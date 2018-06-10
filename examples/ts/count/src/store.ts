import selectPlugin, { getSelect } from '@rematch/select'
import { init } from '@rematch/core'

import * as models from './models'

export { models }
export type models = typeof models

export const select = getSelect<models>()

export const store = init({
	plugins: [selectPlugin()],
	models,
})
