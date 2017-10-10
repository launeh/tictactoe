let readline  = require('readline-sync');
let Player    = require('./player.js');

class Human extends Player {
  constructor(token, name = 'Human') {
    super(token, name);
  }

  move() {
    let move = readline.question(this.prompt);

    /*
     * Allow spaces: (1a, 1 a, 1  a) are all valid
     */
    let [a, b] = move.toLowerCase().split('').filter(token => token.trim() !== '');

    /*
     * Allow 1a or a1
     */
    if (!isNaN(b)) {
      let tmp = a;
      a = b;
      b = tmp;
    }

    let row = a - 1;
    let col = b.charCodeAt(0) - 'a'.charCodeAt(0);
    this.ttt.addToken(this.token, row, col);
  }
}

module.exports = Human;
