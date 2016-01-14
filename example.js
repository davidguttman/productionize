process.env.NODE_ENV = 'production'
var log = require('./')('example')

log.level('trace') // default is 'info'

console.trace('vvvvv')
console.debug('vvvv')
console.info('vvv')
console.warn('vv')
console.error('v')
console.fatal('oh no')

console.log('a string')
console.log({an: 'object', and: [1, 'array']})

uhoh
