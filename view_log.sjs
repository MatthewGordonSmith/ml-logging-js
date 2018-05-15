var logging = require("./logging.sjs");

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

var queries = [];
queries.push(cts.directoryQuery("/logs/", "infinity"));
var name = xdmp.getRequestField("name");
if(name != null) {
  queries.push(cts.jsonPropertyValueQuery("log", name));
}
var since = xdmp.getRequestField("since");
if(since == null) {
  since = new Date();
  since.setDate(since.getDate()-1);
  since = since.toISOString().replace(/Z/g, "");
}
queries.push(cts.jsonPropertyRangeQuery("date", ">=", xs.dateTime(since)));
var level = xdmp.getRequestField("level");
if(level != null) {
  queries.push(cts.jsonPropertyRangeQuery("levelAsNumber", ">=", logging.LEVELS[level]));
}
var logEntryDocuments = cts.search(
  cts.andQuery(queries),
  [cts.indexOrder(cts.jsonPropertyReference("date", ["type=dateTime"]), "ascending")]
)
logEntryDocuments.toArray().map(function(document){
  var logEntry = document.toObject();
  return logEntry.date.padEnd(23) + " " + logEntry.level.padEnd(5) + " [" + logEntry.log + "|" + logEntry.user + "|" + logEntry.address + "] " + logEntry.message;
}).join("\n")
