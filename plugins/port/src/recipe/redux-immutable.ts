import { combineReducers } from 'redux-immutable'
import port from '../port'

/**
 * redux-immutable
 * author: @d3dc
 *
 * Use immutable.js for state
 **/
export default function reduxImmutable(config) {
	return port({
		combineReducers,
	})
}
