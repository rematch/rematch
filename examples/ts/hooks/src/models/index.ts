import { dolphins } from './dolphins'
import { sharks } from './sharks'

export interface RootModel {
	dolphins: typeof dolphins
	sharks: typeof sharks
}

export const models: RootModel = {
	dolphins,
	sharks,
}
