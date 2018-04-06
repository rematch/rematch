export default (reducer: string): boolean => {
  return reducer.startsWith('#') || reducer.includes('/')
}
