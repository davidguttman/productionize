process.env.NODE_ENV = process.env.NODE_ENV || 'development'

var bunyan = require('bunyan')

var loaded

module.exports = function (name) {
  if (!name) throw new Error('Please provide an app name')

  if (loaded) return
  if (process.env.NODE_ENV === 'development') return
  if (process.env.NODE_ENV === 'test') return

  loaded = true

  var log = bunyan.createLogger({name: name})

  console.log = function () { log.info.apply(log, arguments) }

  console.error = function () { log.error.apply(log, arguments) }

  process.on('uncaughtException', function (err) {
    console.error(err)
    process.exit(1)
  })

}
