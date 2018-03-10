'use strict';

const Terminal = require('../core/Terminal');
const helpers = require('../core/Helpers');
const fs = require('fsprom');
const path = require('path');
const childProcess = require('child_process');

const terminal = new Terminal();

module.exports = {
  readFileMetaData: (file, tags = []) => {
    return new Promise((resolve, reject) => {
      const exif = childProcess.spawn('exiftool', tags.concat(['-'])); // read data from stdin
      exif.on('error', (error) => {
        reject(error);
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
          reject(errorMessage);
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
  },
  cleanFileMetaData: () => {
    return new Promise((resolve, reject) => {
      reject(new Error('cleanFileMetaData not implemented yet'));
    });
  },
  backup: (file, options = {}) => {
    return fs.copy(file.name, path.join(options.destination || './backup', file.name));
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
