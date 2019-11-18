# ml-logging-js
Logging for MarkLogic Server-Side JavaScript code in the Log4j style.
* Based on Log4J with the standard logging levels: trace, debug, info, warn, error, and fatal.
* Generic addLogEntry method as well as level-specific methods.
* Factory method to retrieve and reuse “named” log within code.
* Ability to attach appenders of different types to store/write out log entries.
  * Each appender has a level defined and only processes log entries of that level or higher.
  * Examples of current appenders include:
    * Category-tagged standard MarkLogic Error Log appender.
    * MarkLogic Directory appender that creates log entry documents within a MarkLogic database asynchronously according to a configured URI directory structure.
    * Filesystem appender that writes individual log entries as files and then consolidates into a rolling log file.
    * Email appender that sends log entry details to a defined address.
* An application_log.sjs module can be created and included in an ML solution to allow a single place to create and configure logging across the project with simple calls to log.info etc. See below.

* Except for the ML specific appenders and SJS file structure, the code can be reused in any JS code (node, browser etc.).

## Category Tagging

The category tagging allows you to tail the MarkLogic log and show only those log entries for a “realtime” application log:

`tail -f ErrorLog.txt | grep “My Log Name|”`

This will only display the MarkLogic Error Log entries that include your custom log name.

## Common Application Log

A common application_log.sjs module can be created and included in the ML solution to allow a single place to create and configure logging across the project with simple calls to log.info etc.

An example application_log.sjs file may look like:

```
//Require the logging module
var logging = require("./logging.sjs");

//Create a log tagged as "application"
var log = logging.getLog("application");

//Add some appenders, with varying levels
var directoryAppender = require("./directory_appender.sjs").createMarkLogicDirectoryAppender(logging.LEVELS.ALL, "logs");
log.addAppender(directoryAppender);

var emailAppender = require("./email_appender.sjs").createEmailAppender(logging.LEVELS.ERROR, {"name": "Application Administrator", "address": "admin@admin.com"});
log.addAppender(emailAppender);

var fileAppender = require("./file_appender.sjs").createFileAppender(logging.LEVELS.TRACE);
log.addAppender(fileAppender);

var errorlogAppender = require("./errorlog_appender.sjs").createMarkLogicErrorLogAppender(logging.LEVELS.WARN);
log.addAppender(errorlogAppender);

//Export the log object for use throughout the solution
module.exports = log;
```

Then within your code you can include a require statement to add the log and make standard log.info, log.error calls:

```
var log = require("/application_log.sjs");

log.info("This is an informational message.");

log.error("This is an error!");
```
