'use strict';

const dms2dec = require('dms2dec');

module.exports = {
  /**
   * Camelcases a string
   * @param string {string}
   * @param [delimeter=' ']
   * @return {string}
   */
  camelCase: (string, delimeter = ' ') => {
    return string.trim().split(delimeter).map((character, index) => {
      if (index === 0) {
        return character.toLowerCase();
      }
      return character[0].toUpperCase().concat(character.slice(1));
    }).join('');
  },
  /**
   * Converts a DMS string to a LatLng object
   * @param degreeString {string} DMS string
   * @return {object} LatLng
   *   {
   *     lat: <integer>,
   *     lng: <integer>,
   *   }
   */
  convertDegreesToLatLng: (degreeString) => {
    return dms2dec(...degreeString.split(',').reduce((coords, coord) => {
      return coords.concat([coord.slice(0, -1), coord.slice(-1)]);
    }, [])).reduce((coords, coord) => {
      if (coords.lat) {
        coords.lng = coord;
      } else {
        coords.lat = coord;
      }
      return coords;
    }, {});
  },
};
