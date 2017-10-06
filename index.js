var clear = require('clear');

var rl = require('readline').createInterface({
  input  : process.stdin,
  output : process.stdout
});

class TicTacToe {
  constructor(p1 = 'X', p2 = 'O', empty = '-', size = 3) {
    this.size   = size;
    this.movesRemaining  = this.size * this.size;
    this.tokens = {
      p1 : p1,
      p2 : p2,
      empty : empty
    };

    this.player = Math.random() < 0.5 ? p1 : p2;

    this.board = [];
    for (let i = 0; i < this.size; i++) {
      this.board[i] = [];
      for (let j = 0; j < this.size; j++) {
        this.board[i].push(empty);
      }
    }
  }

  show() {
    clear();
    process.stdout.write("\nTic tac toe v1.0.0\n\nTo play use [row][col]. E.g. 1a \n\n ");

    let cols = [];
    var char = 'a';
    for (var i = 0; i < this.size; i++) {
      cols.push(char);
      char = String.fromCharCode(char.charCodeAt(0) + 1);
    }
    process.stdout.write(' ' + cols.join(' ') + "\n");

    for (let i = 0; i < this.size; i++) {
      process.stdout.write(String(i + 1) + ' ' + this.board[i].join('|') + "\n");
    }
    return this;
  }

  addToken(row, col) {
    if (this.board[row] && this.isFree(row, col)) {
      this.board[row][col] = this.player ;
      this.movesRemaining--;
      return true;
    }

    return false;
  }

  switchPlayers() {
    this.player = this.player === this.tokens.p1 ? this.tokens.p2 : this.tokens.p1;
  }

  hasWon(token, row, col) {
    let board = this.board;
    let lines = [];

    //get all the rows
    for(let rowNumber = 0; rowNumber < this.size; rowNumber++) {
      lines.push(board[rowNumber]);
    }

    let getColumn = (array, number) => {
      return array.map(row => row[number]);
    };

    //get all the columns
    for(let c = 0; c < this.size; c++) {
      lines.push(getColumn(board, c));
    }

    //get left right diagonal
    let lr = [];
    for (let i = 0, j = 0; row === col, i < this.size, j < this.size; i++, j++) {
      lr.push(board[i][j]);
    }
    lines.push(lr);

    let rl = [];
    for (let i = 0, j = 0; row + col === this.size -1, i < this.size, j < this.size; i++, j++) {
      rl.push(board[i][j]);
    }
    lines.push(rl);


    let test = (element, index, array) => {
      return element == token;
    };

    return lines.some((line, index, array) => {
      return line.every(test);
    });
  }

  human(line) {
    /*
     * Allow spaces: (1a, 1 a, 1  a) are all valid
     */
    var [a, b] = line.toLowerCase().split('').filter(token => token.trim() !== '');

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
    return this.addToken(row, col);
  }

  isFree(row, col) {
    return this.board[row][col] === this.tokens.empty;
  }

  ai() {
    let isWinning = (token, row, col) => {
      let winning = false;
      this.board[row][col] = token;
      if (this.hasWon(token, row, col)) {
        winning = true;
      }

      this.board[row][col] = this.tokens.empty;
      return false;
    };

    //play winning move
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.isFree(row, col) && isWinning(this.player, row, col)) {
          return this.addToken(row, col);
        }
      }
    }

    //play blocking move
    let otherPlayer = this.player === this.tokens.p1 ? this.tokens.p2 : this.tokens.p1;
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.isFree(row, col) && isWinning(otherPlayer, row, col)) {
          return this.addToken(row, col);
        }
      }
    }

    //play legal move
    let legalMoves = [];
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.isFree(row, col)) {
          legalMoves.push([row, col]);
        }
      }
    }

    let[row, col] = legalMoves[Math.floor(Math.random() * legalMoves.length)];
    return this.addToken(row, col);
  }

  play() {
    var self = this;
    self.show();
    rl.setPrompt(`\n${self.player} : `);
    rl.prompt();
    return rl.on('line', function(line){
      if(!self.human(line)) {
        process.stdout.write("\nInvalid move. Try again\n");
        return rl.prompt();
      }

      if (self.hasWon(self.player)) {
        process.stdout.write(`\nYou won!\n`);
        return rl.close();
      }

      if (self.movesRemaining < 1) {
        process.stdout.write("Draw game: draw\n");
        return rl.close();
      }
      self.switchPlayers();
      self.ai();
      self.show();

      if (self.hasWon(self.player)) {
        process.stdout.write(`\nYou lose!\n`);
        return rl.close();
      }

      self.switchPlayers();
      return rl.prompt();
    });
  }
}

new TicTacToe().play();
