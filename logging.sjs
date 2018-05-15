var Log = function(name) {
  this.name = name;
  this.cacheEntries = false;
  this.allowFunctionDebugging = false;
  this.logEntries = [];
  this.appenders = [];
}
Log.prototype.addAppender = function(appender) {
  this.appenders.push(appender);
}
Log.prototype.addLogEntry = function(level, message) {
  var logEntry = {"level": level, "levelAsNumber": LEVELS[level], "message": message, "date": new Date()};
  if(this.cacheEntries) this.logEntries.push(logEntry);
  this.appenders.forEach(function(appender){
    if(logEntry.levelAsNumber >= appender.level) {
      appender.appendLogEntry(this.name, logEntry);
    }
  }, this);
}
Log.prototype.trace = function(message) {
  this.addLogEntry("TRACE", message);
}
Log.prototype.debug = function(message) {
  this.addLogEntry("DEBUG", message);
}
Log.prototype.info = function(message) {
  this.addLogEntry("INFO", message);
}
Log.prototype.warn = function(message) {
  this.addLogEntry("WARN", message);
}
Log.prototype.error = function(message) {
  this.addLogEntry("ERROR", message);
}
Log.prototype.fatal = function(message) {
  this.addLogEntry("FATAL", message);
}

Log.prototype.debugCurrentFunctionDetails = function(args) {
  if(this.allowFunctionDebugging) {
    var code = args.callee.toString();
    var name = code.substring(0, code.indexOf("(")).split(" ")[1];
    var argumentNames = code.substring(code.indexOf("("), code.indexOf("{")).replace(/([() ])/g,"").split(",");
    var argumentNamesAndValues = {};
    if(argumentNames[0] != "") {
      argumentNames.forEach(function(argumentName, index) {
        argumentNamesAndValues[argumentName] = args[index] != null ? args[index] : null;
      });
    }
    var argumentsJsonString = xdmp.toJsonString(argumentNamesAndValues);
    this.debug(name + "(" + argumentsJsonString.substring(1, argumentsJsonString.length-1) + ")");
  }
}

Log.prototype.debugCurrentFunctionResult = function(result) {
  if(this.allowFunctionDebugging) {
    var code = arguments.callee.caller.toString();
    var name = code.substring(0, code.indexOf("(")).split(" ")[1];
    var resultJsonString = xdmp.toJsonString(result);
    this.debug(name + "() result: " + resultJsonString);
  }
}

Log.prototype.getLogEntries = function(levelAsNumber, formatter) {
  var logEntriesToReturn = [];
  if(levelAsNumber != null) {
    logEntriesToReturn = this.logEntries.filter(function(logEntry){
      return (logEntry.levelAsNumber >= levelAsNumber);
    });
  }
  else {
    logEntriesToReturn = this.logEntries;
  }
  if(formatter != null) {
    return logEntriesToReturn.map(formatter);
  }
  else {
    return logEntriesToReturn;
  }
}


const LEVELS = {
  "ALL":    0,
  "TRACE":  10,
  "DEBUG":  100,
  "INFO":   1000,
  "WARN":   10000,
  "ERROR":  100000,
  "FATAL":  1000000,
  "OFF":    10000000
};

var logs = [];

function getLog(logName) {
  var matchingLogs = logs.filter(function(log){
    return log.name == logName;
  });
  if(matchingLogs.count > 0) {
    return matchingLogs[0];
  }
  else {
    var newLog = new Log(logName);
    logs.push(newLog);
    return newLog;
  }
}

module.exports = {
  "LEVELS": LEVELS,
  "getLog": getLog
}
