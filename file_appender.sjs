//String.startsWith Function
if (!String.prototype.startsWith) {
    String.prototype.startsWith = function(prefix) {
        return this.lastIndexOf(prefix, 0) === 0;
    };
}
//String.endsWith Function
if (!String.prototype.endsWith) {
    String.prototype.endsWith = function(suffix) {
        return this.indexOf(suffix, this.length - suffix.length) !== -1;
    };
}
var FileAppender = function(level, logDirectoryPath) {
  this.level = level;
  var currentDatabaseDataDirectory = xdmp.forestStatus(xdmp.databaseForests(xdmp.database())).toArray()[0].toObject().dataDir;
  if(logDirectoryPath == null) {
    this.logDirectoryPath = currentDatabaseDataDirectory + "/Logs/";
  }
  else if(logDirectoryPath.startsWith("/")) {
    this.logDirectoryPath = logDirectoryPath + (logDirectoryPath.endsWith("/") ? "" : "/");
  }
  else {
    this.logDirectoryPath = currentDatabaseDataDirectory + "/Logs/" + logDirectoryPath + (logDirectoryPath.endsWith("/") ? "" : "/");
  }
};
FileAppender.prototype.appendLogEntry = function(logName, logEntry) {
  logEntry.log = logName;
  logEntry.user = xdmp.getCurrentUser();
  var clientAddress =xdmp.getRequestClientAddress();
  logEntry.address = clientAddress != null ? clientAddress : xdmp.hostName();
  xdmp.filesystemDirectoryCreate(this.logDirectoryPath + logName, {"createParents": true});
  var logEntriesDirectoryPath = this.logDirectoryPath + logName;
  var logEntryFilePath = logEntriesDirectoryPath + "/" + sem.uuidString() + ".json";
  xdmp.save(logEntryFilePath, logEntry);
  xdmp.spawn(
    "/consolidate_filesystem_log_entries.sjs",
    {
      "logEntriesDirectoryPath": logEntriesDirectoryPath
    }
  );
};
function createFileAppender(level, logDirectoryPath) {
  return new FileAppender(level, logDirectoryPath);
}
module.exports = {
  "createFileAppender": createFileAppender
}
