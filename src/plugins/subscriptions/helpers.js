export const omit = (prop: string, obj = {}) =>
  Object.keys(obj).reduce((next, key: string) => {
    if (key !== prop) {
      next[key] = obj[key]
    }
    return next
  }, {})
