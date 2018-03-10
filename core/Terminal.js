'use strict';

const rl = require('readline');

class Terminal {
  /**
   * TTY Controller
   * @param [input] {Socket}
   * @param [output] {Socket}
   */
  constructor(input, output) {
    this.rlInterface = new rl.createInterface({
      input: input || process.stdin,
      output: output || process.stdout,
    });
  }

  /**
   * Prompts for user input
   * @param question {string} Text to be sent
   * @return {Promise<string>} User input
   */
  prompt(question) {
    return new Promise((resolve) => {
      this.rlInterface.question(question, answer => resolve(answer));
    });
  }

  /**
   * Tests if answer stems to 'yes'
   * @param answer {string} User answer
   * @return {boolean}
   */
  isAnswerYes(answer) { // eslint-disable-line class-methods-use-this
    return answer ? typeof answer === 'string' && answer.toLowerCase()[0].match(/^(ja?|ye?s?)/i) : false;
  }
}
module.exports = Terminal;
