//Pass logEntriesDirectoryPath as a string parameter

//String.endsWith Function
if (!String.prototype.endsWith) {
    String.prototype.endsWith = function(suffix) {
        return this.indexOf(suffix, this.length - suffix.length) !== -1;
    };
}
//String.padEnd Function
if (!String.prototype.padEnd) {
    String.prototype.padEnd = function padEnd(targetLength,padString) {
        targetLength = targetLength>>0; //floor if number or convert non-number to 0;
        padString = String(padString || ' ');
        if (this.length > targetLength) {
            return String(this);
        }
        else {
            targetLength = targetLength-this.length;
            if (targetLength > padString.length) {
                padString += padString.repeat(targetLength/padString.length); //append to original to ensure we are longer than needed
            }
            return String(this) + padString.slice(0,targetLength);
        }
    };
}
var consolidatedLogFilePath = logEntriesDirectoryPath + "/" + "log.txt";
var lockFilePath = consolidatedLogFilePath + ".lock";
while(xdmp.filesystemFileExists(lockFilePath)) {
  xdmp.sleep(1000);
}
xdmp.save(lockFilePath, xdmp.toJSON("lock"));
var jsonFileEntries = xdmp.filesystemDirectory(logEntriesDirectoryPath).filter(function(directoryEntry){
  return directoryEntry.type == "file" && directoryEntry.pathname.endsWith(".json");
});
if(jsonFileEntries.length > 0) {
  var logEntries = jsonFileEntries.map(function(fileEntry){
    return xdmp.unquote(xdmp.filesystemFile(fileEntry.pathname)).toArray()[0].toObject();
  }).sort(function(a,b){
    if(a.date > b.date) return 1;
    if(a.date < b.date) return -1;
    return 0;
  });
  var formattedLogEntriesText = logEntries.map(function(logEntry){
    return logEntry.date.padEnd(23) + " " + logEntry.level.padEnd(5) + " [" + logEntry.log + "|" + logEntry.user + "|" + logEntry.address + "] " + logEntry.message;
  }).join("\n");
  var consolidatedLogFilePath = logEntriesDirectoryPath + "/" + "log.txt";
  if(xdmp.filesystemFileExists(consolidatedLogFilePath)) {
    formattedLogEntriesText = xdmp.filesystemFile(consolidatedLogFilePath) + "\n" + formattedLogEntriesText;
  }
  xdmp.save(consolidatedLogFilePath, xdmp.toJSON(formattedLogEntriesText));
  jsonFileEntries.forEach(function(fileEntry){
    xdmp.filesystemFileDelete(fileEntry.pathname);
  });
}
xdmp.filesystemFileDelete(lockFilePath);
