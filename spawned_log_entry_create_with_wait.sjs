var log = require("/application_log.sjs");
var millisecondsToWait = parseInt(Math.random() * 10000);
xdmp.sleep(millisecondsToWait);
log.info("ID " + id + " - Waited " + millisecondsToWait + " milliseconds before creating this log entry.");
