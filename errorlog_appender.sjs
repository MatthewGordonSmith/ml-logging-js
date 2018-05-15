const LOG_LEVEL_MAPPINGS = {
  "TRACE":  "fine",
  "DEBUG":  "debug",
  "INFO":   "info",
  "WARN":   "warning",
  "ERROR":  "error",
  "FATAL":  "critical"
};
var MarkLogicErrorLogAppender = function(level) {
  this.level = level;
};
MarkLogicErrorLogAppender.prototype.appendLogEntry = function(logName, logEntry) {
  logEntry.log = logName;
  logEntry.user = xdmp.getCurrentUser();
  var clientAddress =xdmp.getRequestClientAddress();
  logEntry.address = clientAddress != null ? clientAddress : xdmp.hostName();
  var message = "[" + logEntry.log + "|" + logEntry.user + "|" + logEntry.address + "] " + logEntry.message;
  xdmp.log(message, LOG_LEVEL_MAPPINGS[logEntry.level]);
};
function createMarkLogicErrorLogAppender(level) {
  return new MarkLogicErrorLogAppender(level);
}
module.exports = {
  "createMarkLogicErrorLogAppender": createMarkLogicErrorLogAppender
}
