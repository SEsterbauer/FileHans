'use strict';

const path = require('path');
const cluster = require('cluster');
const util = require('util');

/**
 * Sets the module-wide label to the module file's name
 * @param callingModule {Module}
 */
function setLabel(callingModule) {
  if (!callingModule) return '';
  if (typeof callingModule === 'string') return `${callingModule}:`;
  const label = callingModule.filename
    .replace(`${path.dirname(require.main.filename)}/`, '')
    .replace('/', '.')
    .replace(/^\.|node_modules\/mocha\/bin|app|index|core\.|classes\.|\.js$/ig, '');
  return `[${cluster.isMaster ? 'main' : `worker ${cluster.worker.id}`}]${label.trim() ? ` ${label}:` : ''}`;
}

/**
 * Returns an actual local timestamp
 * @return {string} timestamp
 */
function getTimestamp() {
  return process.env.LOG_TIMESTAMPS && process.env.LOG_TIMESTAMPS.toLowerCase() !== 'false' ?
    new Date().toLocaleString() : '';
}

/**
 * Logger overwrites for better control
 * @param module {Module}
 */
module.exports = (module) => {
  const label = module ? setLabel(module) : '';
  const logger = new console.Console(process.stdout, process.stderr);
  logger.dir = (variable) => {
    if (process.env.LOG_LEVEL === 'verbose') {
      console.dir(variable);
    }
  };
  logger.log = (...messages) => {
    if (process.env.LOG_LEVEL === 'verbose') {
      console.log(getTimestamp(), label, ...messages);
    }
  };
  logger.info = (...messages) => {
    console.info(getTimestamp(), label, ...messages);
  };
  logger.warn = (...messages) => {
    console.warn(getTimestamp(), label, ...messages);
  };
  logger.error = (...messages) => {
    console.error(getTimestamp(), label, ...messages);
  };
  logger.debug = (section) => {
    util.debuglog(section);
  };
  logger.inspect = (variable, options) => {
    util.inspect(variable, options === true ? { depth: null } : options);
  };
  return logger;
};
