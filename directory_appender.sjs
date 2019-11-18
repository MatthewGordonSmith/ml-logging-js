//String.startsWith Function
if (typeof String.prototype.startsWith !== "function") {
    String.prototype.startsWith = function(prefix) {
        return this.lastIndexOf(prefix, 0) === 0;
    };
}
//String.endsWith Function
if (typeof String.prototype.endsWith !== "function") {
    String.prototype.endsWith = function(suffix) {
        return this.indexOf(suffix, this.length - suffix.length) !== -1;
    };
}

var MarkLogicDirectoryAppender = function(level, baseDirectoryPath, fileNameFunction, database) {
  this.level = level;
  if(baseDirectoryPath == null || baseDirectoryPath == "") {
    this.baseDirectoryPath = "/";
  }
  else {
    this.baseDirectoryPath = (baseDirectoryPath.startsWith("/") ? "" : "/") + baseDirectoryPath + (baseDirectoryPath.endsWith("/") ? "" : "/");
  }
  this.fileNameFunction = fileNameFunction;
  this.numberOfEntriesAppended = 0;
  this.database = database;
};

MarkLogicDirectoryAppender.prototype.getFileName = function(logEntry) {
  if(this.fileNameFunction != null) {
    return this.fileNameFunction(logEntry, this.numberOfEntriesAppended);
  }
  else {
    return sem.uuidString() + ".json";
  }
}

MarkLogicDirectoryAppender.prototype.appendLogEntry = function(logName, logEntry) {
  var uri = this.baseDirectoryPath + logName + "/" + this.getFileName(logEntry);
  logEntry.log = logName;
  logEntry.user = xdmp.getCurrentUser();
  var clientAddress =xdmp.getRequestClientAddress();
  logEntry.address = clientAddress != null ? clientAddress : xdmp.hostName();
  var variables = {
    "uri": uri,
    "document": logEntry,
    "permissions": [],
    "collections": [
      "Log"
    ]
  };
  if(this.database != null) variables.database = this.database;
  xdmp.spawn(
    "/document_insert.sjs",
    variables
  );
  this.numberOfEntriesAppended++;
}

function createMarkLogicDirectoryAppender(level, baseDirectoryPath, fileNameFunction) {
  return new MarkLogicDirectoryAppender(level, baseDirectoryPath, fileNameFunction);
}

module.exports = {
  "createMarkLogicDirectoryAppender": createMarkLogicDirectoryAppender
}
