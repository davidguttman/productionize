process.env.NODE_ENV = process.env.NODE_ENV || 'development'

var pino = require('pino')
var round = require('lodash.round')
var forEach = require('lodash.foreach')
var isObject = require('lodash.isobject')

var loaded

module.exports = function (name, minLevel) {
  if (!name) throw new Error('Please provide an app name')

  if (loaded) return
  if (process.env.NODE_ENV === 'development') return {}
  if (process.env.NODE_ENV === 'test') return {}

  loaded = true

  var log = pino({
    name: name,
    slowtime: true,
    serializers: pino.stdSerializers
  })

  log.level = minLevel || 'trace'

  console.log = roundLog(log, 'info')

  var levels = ['fatal', 'error', 'warn', 'info', 'debug', 'trace']
  levels.forEach(function (level) { console[level] = roundLog(log, level) })

  process.on('uncaughtException', function (err) {
    log.fatal(err)
    process.exit(1)
  })

  return log
}

function roundLog (logger, level) {
  var fn = function () {
    forEach(arguments, function (arg) {
      if (!isObject(arg)) return

      forEach(arg, function (val, key) {
        if (typeof val === 'number') arg[key] = round(val, 6)
      })
    })

    return logger[level].apply(logger, arguments)
  }
  return fn
}
