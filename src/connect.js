// @flow
import { subscribe } from './store'

export let connect : (any => any) = () => { // eslint-disable-line
  throw new Error('rematch.init must be called before calling rematch.connect')
}

export const registerConnect = (viewImplementation : any => any) : void => {
  connect = viewImplementation(subscribe)
}

