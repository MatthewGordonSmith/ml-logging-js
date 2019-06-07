var logging = require("./logging.sjs");
/*
  Create the default application log and appenders
  This can be included and used by simply requiring this module:
    var log = require("/lib/application-log.sjs");
    log.info("A test message.");
  You can also grab a differently-named log that still uses the defaultAppenders
    var log = require("/lib/application-log.sjs")
      .getLogByNameWithDefaultAppenders("other_log_name");
    log.info("A test message to the other log.");
*/
var defaultAppenders = [];

var marklogicErrorLogAppender = require("./errorlog-appender.sjs").createMarkLogicErrorLogAppender(logging.LEVELS.ALL);
defaultAppenders.push(marklogicErrorLogAppender);

var directoryAppender = require("./directory-appender.sjs").createMarkLogicDirectoryAppender(logging.LEVELS.ALL, "logs");
defaultAppenders.push(directoryAppender);

var applicationLog = logging.getLog("application");
applicationLog.setAppenders(defaultAppenders);

//Add the getLogWithDefaultAppenders function to the export
applicationLog.getLogByNameWithDefaultAppenders = function(logName) {
  var logWithDefaultAppenders = logging.getLog(logName);
  logWithDefaultAppenders.setAppenders(defaultAppenders);
  return logWithDefaultAppenders;
}

module.exports = applicationLog;
