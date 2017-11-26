export default (obj: Object): boolean => (Array.isArray(obj) || typeof obj !== 'object')
