var EmailAppender = function(level, toAddress) {
  this.level = level;
  this.toAddress = toAddress;
};
EmailAppender.prototype.appendLogEntry = function(logName, logEntry) {
  logEntry.log = logName;
  logEntry.user = xdmp.getCurrentUser();
  var clientAddress =xdmp.getRequestClientAddress();
  logEntry.address = clientAddress != null ? clientAddress : xdmp.hostName();
  xdmp.email({
    "to": this.toAddress,
    "subject": "New " + logEntry.level + " Log Entry in " + logEntry.log + " Log",
    "content": JSON.stringify(logEntry)
  });
};
function createEmailAppender(level, toAddress) {
  return new EmailAppender(level, toAddress);
}
module.exports = {
  "createEmailAppender": createEmailAppender
}
