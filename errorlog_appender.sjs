var vkBeautify = require("./vkbeautify.sjs");

const LEVELS_TO_MARKLOGIC_ERRORLOG_LEVELS = {
  "TRACE":  "fine",
  "DEBUG":  "debug",
  "INFO":   "info",
  "WARN":   "warning",
  "ERROR":  "error",
  "FATAL":  "critical"
}
var MarkLogicErrorLogAppender = function(level) {
  this.level = level;
};
MarkLogicErrorLogAppender.prototype.appendLogEntry = function(logName, logEntry) {
  logEntry.user = xdmp.getCurrentUser();
  var clientAddress = xdmp.getRequestClientAddress();
  logEntry.address = clientAddress != null ? clientAddress : xdmp.hostName();
  var message = logEntry.message;
  if(message.toObject) message = message.toObject();
  if(typeof message == "object") message = vkBeautify.json(message, 4);
  xdmp.log("[" + logName + " | " + logEntry.user + " | " + logEntry.address + "] " + message, LEVELS_TO_MARKLOGIC_ERRORLOG_LEVELS[logEntry.level]);
}
function createMarkLogicErrorLogAppender(level) {
  return new MarkLogicErrorLogAppender(level);
}
module.exports = {
  "createMarkLogicErrorLogAppender": createMarkLogicErrorLogAppender
}
