import { dolphins } from './dolphins'
import { sharks } from './sharks'

// no need to extend from Models
export interface RootModel {
	dolphins: typeof dolphins
	sharks: typeof sharks
}

export const models: RootModel = { dolphins, sharks }
