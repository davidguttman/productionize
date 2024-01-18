process.env.NODE_ENV = process.env.NODE_ENV || 'development'

const pino = require('pino')
const round = require('lodash.round')
const forEach = require('lodash.foreach')
const isObject = require('lodash.isobject')

let loaded

module.exports = function (name, minLevel) {
  if (!name) throw new Error('Please provide an app name')

  if (loaded) return
  if (process.env.NODE_ENV === 'development') return {}
  if (process.env.NODE_ENV === 'test') return {}

  loaded = true

  const log = pino({
    name,
    slowtime: true,
    serializers: pino.stdSerializers
  })

  log.level = minLevel || 'trace'

  console.log = roundLog(log, 'info')

  const levels = ['fatal', 'error', 'warn', 'info', 'debug', 'trace']
  levels.forEach(function (level) {
    console[level] = roundLog(log, level)
  })

  process.on('uncaughtException', function (err) {
    log.fatal(err)
    process.exit(1)
  })

  return log
}

function roundLog (logger, level) {
  const fn = function () {
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
