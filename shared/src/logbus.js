const EventEmitter = require('events')

class LogBus extends EventEmitter {}

const bus = new LogBus()

function emitLog(entry) {
  try {
    bus.emit('log', entry)
  } catch (e) {
    // ignore
  }
}

module.exports = { bus, emitLog }
