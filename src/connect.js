// @flow
import { listen } from './store'

export let connect : (any => any) // eslint-disable-line

export const registerConnect = (viewImplementation : any => any) : void => {
  connect = viewImplementation(listen)
}

