import { dolphins } from './dolphins'
import { sharks } from './sharks'

// no need to extend from Models
export type RootModel = {
	dolphins: typeof dolphins
	sharks: typeof sharks
}

export const models: RootModel = { dolphins, sharks }
