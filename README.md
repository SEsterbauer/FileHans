# FileHans

is your terminal buddy to inspect directories of files, display meta-data like EXIF data, display the location of a file creation (e.g. a picture capture) in a map and to remove EXIF data from a whole host of files.

#### Setup:

- Install the exiftool CLI tool:
  ```bash
  sudo apt-get update
  sudo apt-get install libimage-exiftool-perl
  ```
  
- Install npm dependencies:
  ```bash
  npm install
  ```

#### Visit FileHans in his office:
  `node app.js`

#### Argv variables:

`--file | -f` - The FS path to operate on. Can be a file or directory (has priority over the FILE Environment Variable)

#### Environment variables:

`FILE` - The FS path to operate on. Can be a file or directory

`LOG_LEVEL` ['verbose'] - Allow .log and .dir logs

`LOG_TIMESTAMPS` ['true'] - Prepend timestamps to logs
