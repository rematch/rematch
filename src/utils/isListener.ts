/**
 * isListener
 *
 * determines if an action is a listener on another model
 */
export default (reducer: string): boolean => reducer.includes('/')
