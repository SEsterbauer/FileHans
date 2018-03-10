# FileHans
inspects directories of files, displays meta-data like EXIF data, ships with features like a map to display the location of a picture capture and provides a tool to remove all meta-data from a whole host of files.

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
  
#### Argv variables:

`--file | -f` - The FS path to operate on. Can be a file or directory

#### Environment variables:

`FILE` - The FS path to operate on. Can be a file or directory

`LOG_LEVEL` ['verbose'] - Allow .log and .dir logs

`LOG_TIMESTAMPS` ['true'] - Prepend timestamps to logs
