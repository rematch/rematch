export default (obj: object): boolean => (Array.isArray(obj) || typeof obj !== 'object')
