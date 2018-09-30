import { init } from '@rematch/core'

import * as models from './models'

export { models }
export type models = typeof models

export const store = init({
	models,
})
