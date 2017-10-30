export default (fn, ...fns) => (...args) => fns.reduce((acc, fni) => fni(acc), fn(...args))
