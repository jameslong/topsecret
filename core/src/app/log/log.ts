import LoggerClient = require('./loggerclient');
import LoggerNode = require('./loggernode');

const Logger = typeof window === undefined ? LoggerClient : LoggerNode;
export = Logger;
