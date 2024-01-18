process.env.NODE_ENV = process.env.NODE_ENV || 'development'

const pino = require('pino')
const { round, forEach, isObject } = require('lodash')

let loaded

module.exports = function (name, config = {}) {
  if (!name) throw new Error('Please provide an app name')

  if (loaded) return
  if (process.env.NODE_ENV === 'development') return {}
  if (process.env.NODE_ENV === 'test') return {}

  loaded = true

  const log = pino({
    name,
    slowtime: true,
    serializers: pino.stdSerializers,
    transport: config.transport
  })

  log.level = config.minLevel || 'trace'

  const oldLog = console.log
  console.log = roundLog(log, 'info')

  const levels = ['fatal', 'error', 'warn', 'info', 'debug', 'trace']
  levels.forEach(function (level) {
    console[level] = roundLog(log, level)
  })

  process.on('uncaughtException', function (err) {
    log.fatal(err)
    oldLog(err)
    process.exit(1)
  })

  return log
}

function roundLog (logger, level) {
  const fn = function (a, b) {
    forEach(arguments, function (arg) {
      if (!isObject(arg)) return

      forEach(arg, function (val, key) {
        if (typeof val === 'number') arg[key] = round(val, 6)
      })
    })

    const args = b && isObject(b) ? [b, a] : [a, b]
    return logger[level].apply(logger, args)
  }
  return fn
}
