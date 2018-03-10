'use strict';

require('dotenv').config();
const pjson = require('./package.json');
const logger = require('./core/Logger')(module);
const hans = require('./classes/Hans');
const path = require('path');
const anyparse = require('anyparse');
const fs = require('fsprom');
const Promise = require('bluebird');

logger.info(`FileHans v${pjson.version}`);

let settings;
// parse and merge input variables with priority on argv
Promise.all([anyparse.parse('argv'), anyparse.parse('env')])
  .then(([argv, env]) => {
    settings = Object.assign({}, env);
    Object.assign(settings, argv);
    if (!settings.FILE) {
      if (!settings.f && !settings.file) {
        throw new Error('Specify the file to operate on!');
      }
      settings.FILE = settings.file || settings.f;
    }
    hans.say("Some work for FileHans? Put it on the shelf over there, I'll just finish that one Netflix episode.."); // eslint-disable-line max-len
    // get stats of input file
    return fs.stat(settings.FILE);
  })
  // get name and buffer of file(s)
  .then((objectStats) => {
    if (!objectStats.isDirectory()) {
      return fs.read(settings.FILE)
        .then(contentBuffer => ({
          name: settings.FILE,
          buffer: contentBuffer,
        }));
    }
    return fs.dir(settings.FILE)
      .then(directoryItems => Promise.map(directoryItems, (directoryItem) => {
        const fileName = path.join(settings.FILE, directoryItem);
        return fs.read(fileName)
          .then(contentBuffer => ({
            name: fileName,
            buffer: contentBuffer,
          }));
      }));
  })
  .then((files) => {
    if (!Array.isArray(files)) {
      files = [files]; // eslint-disable-line no-param-reassign
    }
    // get meta info and stats of file(s)
    return Promise.map(files, file => hans.readFileMetaData(file)
      .then(metaInfo => fs.stat(file.name)
        .then(stats => Object.assign(file, { metaInfo, stats }))
      )
    )
      // wizard dialogue
      .then(bulkInfo => hans.ask(`Oh, you say you need it now? Let me look.. Ah! I found heaps of information about ${settings.FILE}! Hit Enter to collapse it`) // eslint-disable-line max-len
        .then(() => {
          hans.say(bulkInfo);
          return hans.ask('Would you like me to clean all the meta-data?');
        })
      )
      .then(answer => hans.terminal.isAnswerYes(answer) ?
        hans.ask("If you think you could need those files' meta data anywhen again, now'd be the best moment to tell me! Should I create a backup before cleaning?") : // eslint-disable-line max-len
        hans.exit()
      )
      .then(answer => hans.terminal.isAnswerYes(answer) ?
        hans.ask("Shall I store the backup at any specific directory? Tell me it's name or leave empty to use './backup'") : // eslint-disable-line max-len
        hans.cleanFileMetaData()
          .then(() => hans.exit())
      )
      .then(answer => Promise.map(files, file => hans.backup(file, { destination: answer })))
      .then(() => hans.cleanFileMetaData());
  })
  .catch((error) => {
    logger.error(error.stack);
  });
