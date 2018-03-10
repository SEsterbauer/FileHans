'use strict';

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
};
