const pino = require('pino')

const logger = pino({
  level: process.env.LOG_LEVEL || 'info'
})

function child(bindings) {
  return logger.child(bindings || {})
}

module.exports = { logger, child }
