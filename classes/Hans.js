'use strict';

const Terminal = require('../core/Terminal');
const helpers = require('../core/Helpers');
const fs = require('fsprom');
const path = require('path');
const childProcess = require('child_process');

const terminal = new Terminal();

/**
 * exiftool Wrapper
 * @param file {object}
 * @param file.name {string}
 * @param file.buffer {buffer}
 * @param [options] {object}
 * @param [options.tags] {string[]} Tags to pass to the exiftool call
 * @param [options.clean] {boolean} Remove all EXIF data if true
 * @return {Promise<object>} Meta data
 */
function exiftoolCall(file, options = {}) {
  if (!options.tags) {
    options.tags = [];
  }
  if (options.clean) {
    options.tags.push('-all');
  }
  options.tags = options.tags.concat(['-']);
  return new Promise((resolve, reject) => {
    const exif = childProcess.spawn('exiftool', options.tags);
    exif.on('error', (error) => {
      reject(new Error(error));
    });
    let response = '';
    let errorMessage = '';
    exif.stdout.on('data', (data) => {
      response += data;
    });
    exif.stderr.on('data', (data) => {
      errorMessage += data.toString();
    });
    exif.on('close', () => {
      if (errorMessage) {
        reject(new Error(errorMessage));
        return;
      }
      resolve(response.split('\n').reduce((metaData, responseLine) => {
        const keyPair = responseLine.split(': ');
        if (keyPair.length !== 2) {
          return metaData;
        }
        let value = keyPair[1].trim();
        if (!isNaN(value)) {
          value = parseFloat(value);
        }
        metaData[helpers.camelCase(keyPair[0], ' ')] = value;
        return metaData;
      }, {}));
    });
    exif.stdin.write(file.buffer);
    exif.stdin.end();
  });
}

module.exports = {
  /**
   * Read a file's EXIF data
   * @see exiftoolCall
   * @return {Promise<object>} Meta data
   */
  readFileMetaData: (file) => {
    return exiftoolCall(file);
  },
  /**
   * Read a file's EXIF data
   * @see exiftoolCall
   * @return {Promise<object>} Meta data
   */
  cleanFileMetaData: (file) => {
    return exiftoolCall(file, { clean: true });
  },
  backup: (file, options = {}) => {
    return fs.copy(file.name, path.join(fs.pwd(), path.join(options.destination || './backup', file.name)));
  },
  say: (stuff) => {
    console.log(stuff);
  },
  ask: (question) => {
    return terminal.prompt(question.concat('\n'));
  },
  exit: () => {
    module.exports.say("I'll be doing some inspections till your next visit! See you ;)");
    process.exit(1);
  },
  terminal,
};
