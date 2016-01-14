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

  console.log = log.info.bind(log)

  var levels = ['fatal', 'error', 'warn', 'info', 'debug', 'trace']
  levels.forEach(function (level) { console[level] = log[level].bind(log) })

  process.on('uncaughtException', function (err) {
    log.fatal(err)
    process.exit(1)
  })

  return log
}
