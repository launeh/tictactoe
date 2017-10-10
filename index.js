var clear = require('clear');
let readline = require('readline-sync');


class TicTacToe {
  constructor(players, size) {
    this.rows = size && size.rows ? size.rows : 3;
    this.cols = size && size.cols ? size.cols : 3;
    this.movesRemaining  = this.rows * this.cols;
    this.board = [];
    this.EMPTY = '-';
    for (let row = 0; row < this.rows; row++) {
      this.board[row] = [];
      for (let col = 0; col < this.cols; col++) {
        this.board[row].push(this.EMPTY);
      }
    }

    players.forEach((player) => {
      player.ttt = this;
    });
    this.players = players;
  }

  status() {
    for (let i = 0; i < this.players.length; i++) {
      if (this.hasWon(this.players[i].token)) {
        return `${this.players[i].name}(${this.players[i].token}) won!`;
      }
    }

    if (this.movesRemaining < 1) {
      return 'Strange game.\nThe only winning move is not to play.\nHow about a nice game of chess?';
    }

    return 'Playing...';
  }

  isOver() {
    if (this.movesRemaining < 1) {
      return true;
    }
    return false;
  }

  nextPlayer() {
    return this.players[(this.movesRemaining + 1) % this.players.length];
  }

  show() {
    clear();
    process.stdout.write("\nTic tac toe v1.0.0\n\nTo play use [row][col]. E.g. 1a \n\n ");

    let cols = [];
    var char = 'a';
    for (var i = 0; i < this.cols; i++) {
      cols.push(char);
      char = String.fromCharCode(char.charCodeAt(0) + 1);
    }

    process.stdout.write(' ' + cols.join(' ') + "\n");

    for (let i = 0; i < this.rows; i++) {
      process.stdout.write(String(i + 1) + ' ' + this.board[i].join('|') + "\n");
    }
    return this;
  }

  addToken(token, row, col) {
    if (!token) {
      throw new Error('Token required');
    }

    if (typeof row === 'undefined' || typeof col === 'undefined') {
      throw new Error('row and col required');
    }

    if (this.board[row] && this.board[row][col] && this.isFree(row, col)) {
      this.board[row][col] = token;
      if (this.hasWon(token)) {
        this.movesRemaining = 0;
      } else {
        this.movesRemaining--;
      }
      return true;
    }
    return false;
  }

  hasWon(token) {
    let board = this.board;
    let lines = [];

    //get all the rows
    for(let rowNumber = 0; rowNumber < this.rows; rowNumber++) {
      lines.push(board[rowNumber]);
    }

    let getColumn = (array, number) => {
      return array.map(row => row[number]);
    };

    //get all the columns
    for(let c = 0; c < this.cols; c++) {
      lines.push(getColumn(board, c));
    }

    //get left right diagonal
    let lr = [];
    for (let i = 0, j = 0; i < this.rows, j < this.cols; i++, j++) {
      lr.push(board[i][j]);
    }
    lines.push(lr);

    let rl = [];
    for (let i = 0, j = this.cols - 1; i < this.rows, j >= 0; i++, j--) {
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

  isFree(row, col) {
    if (row < 0 || row >= this.rows || col < 0 || col > this.cols) {
      return false;
    }

    return this.board[row][col] === this.EMPTY;
  }

  getLegalMoves() {
    //play legal move
    let legalMoves = [];
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        if (this.isFree(row, col)) {
          legalMoves.push([row, col]);
        }
      }
    }
    return legalMoves;
  }

  play() {
    this.show();
    while (!this.isOver()) {
      this.nextPlayer().move();
      this.show();
    }

    process.stdout.write("\n" + this.status() + "\n\n");
  }
}

class Player {
  constructor(token, name = 'Player') {
    this.token = token;
    this.name  = name;
    this.prompt = this.name + '(' + this.token + '): ';
  }
  move() {
    throw new Error('Unimplemented');
  }
}

class Human extends Player {

  constructor(token, name = 'Human') {
    super(token, name);
  }

  move() {
    let move = readline.question(this.prompt);
    /*
     * Allow spaces: (1a, 1 a, 1  a) are all valid
     */
    var [a, b] = move.toLowerCase().split('').filter(token => token.trim() !== '');
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

class AI extends Player {
  constructor(token, name = 'WOPR') {
    super(token, name);
  }

  move() {
    let ttt = this.ttt;

    let isWinning = (token, row, col) => {
      let winning = false;
      ttt.board[row][col] = token;
      if (ttt.hasWon(token, row, col)) {
        winning = true;
      }

      ttt.board[row][col] = ttt.EMPTY;
      return false;
    };

    //play winning move
    for (let row = 0; row < ttt.rows; row++) {
      for (let col = 0; col < ttt.cols; col++) {
        if (ttt.isFree(row, col) && isWinning(this.token, row, col)) {
          return ttt.addToken(row, col);
        }
      }
    }

    //play blocking move
    for (let row = 0; row < ttt.rows; row++) {
      for (let col = 0; col < ttt.cols; col++) {
        if (ttt.isFree(row, col) && isWinning(ttt.nextPlayer().token, row, col)) {
          return ttt.addToken(row, col);
        }
      }
    }

    //prefer the center
    if (ttt.isFree(Math.floor(ttt.rows / 2), Math.floor(ttt.cols / 2))) {
      return ttt.addToken(this.token, Math.floor(ttt.rows / 2), Math.floor(ttt.cols / 2));
    }

    //play a random legal move
    let legalMoves = ttt.getLegalMoves();
    let[row, col] = legalMoves[Math.floor(Math.random() * legalMoves.length)];

    return ttt.addToken(this.token, row, col);
  }
}

let tokens = Math.random() < 0.5 ? ['X', 'O'] : ['O', 'X'];
let names  = Math.random() < 0.5 ? ['WOPR', 'HAL'] : ['HAL', 'WOPR'];

//AI vs AI
new TicTacToe([new AI(tokens[0], names[0]), new AI(tokens[1], names[1])], {rows: 3, cols: 3}).play();

//Human vs AI
//new TicTacToe([new Human(tokens[0]), new AI(tokens[1], names[1])], {rows: 3, cols: 3}).play();

//AI vs Human
//new TicTacToe([new AI(tokens[0]), new Human(tokens[1])], {rows: 3, cols: 3}).play();

//AI vs Human
//new TicTacToe([new Human(tokens[0]), new Human(tokens[1])], {rows: 3, cols: 3}).play();
