process.env.NODE_ENV = 'production'
var log = require('./')('example')

log.level = 'trace' // default is 'info'

console.trace('vv')
console.debug('v')
console.info('the usual')
console.warn('look at me')
console.error('seriously look at me')
console.fatal('oh no')

console.log('default log')
console.log({
  an: 'object',
  and: [1, 'array'],
  nan: NaN,
  longFloat: 0.12345678901
})

uhohRefError
