import validate from './validate'

export default (plugins) => plugins.reduce((exposed, plugin) => ({
  ...exposed,
  ...(plugin.expose || {})
}), {
  validate,
})
