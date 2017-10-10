let clear    = require('clear');
let readline = require('readline-sync');
let AI       = require('./ai');

class TicTacToe {
  constructor(size = {rows : 3, cols : 3}) {
    this.EMPTY = '-';
    this.rows = parseInt(size.rows);
    this.cols = parseInt(size.cols);

    if (this.rows < 3) {
      throw new Error('At least 3 rows required');
    }

    if (this.cols < 3) {
      throw new Error('At least 3 cols required');
    }

    this.movesRemaining  = this.rows * this.cols;
    this.board = [];
    this.history = [];

    for (let row = 0; row < this.rows; row++) {
      this.board[row] = [];
      for (let col = 0; col < this.cols; col++) {
        this.board[row].push(this.EMPTY);
      }
    }
  }

  addPlayers(players = []) {
    this.players = (!players || players.length < 1) ? [new AI('X', 'WOPR'), new AI('O', 'WOPR')] : players;
    this.players.forEach((player) => player.ttt = this);
    return this;
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
    return this.movesRemaining < 1;
  }

  player() {
    return this.players[(this.movesRemaining - 1) % this.players.length];
  }

  nextPlayer() {
    return this.players[this.movesRemaining % this.players.length];
  }

  show() {
    clear();
    process.stdout.write("Use [row][col]. E.g. 1a \n\n ");

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
      this.movesRemaining = this.hasWon(token) ? 0 : this.movesRemaining - 1;
      this.history.push({token : token, row : row, col : col});
      return true;
    }
    return false;
  }

  getLines() {
    let lines = [];

    //get all the rows
    for(let rowNumber = 0; rowNumber < this.rows; rowNumber++) {
      lines.push(this.board[rowNumber]);
    }

    let getColumn = (board, colNum) => board.map(row => row[colNum]);

    //get all the columns
    for(let c = 0; c < this.cols; c++) {
      lines.push(getColumn(this.board, c));
    }

    //get left right diagonal
    let lr = [];
    for(let i = 0, j = 0; i < this.rows, j < this.cols; i++, j++) {
      lr.push(this.board[i][j]);
    }
    lines.push(lr);

    //get right left diagonal
    let rl = [];
    for(let i = 0, j = this.cols - 1; i < this.rows, j >= 0; i++, j--) {
      rl.push(this.board[i][j]);
    }
    lines.push(rl);
    return lines;
  }

  hasWon(token) {
    if (!token) {
      throw new Error('[hasWon] Token required');
    }

    let test = (cell, idx, array) => cell === token;

    return this.getLines().some((line, idx, array) => line.every(test));
  }

  isFree(row, col) {
    return row >= 0 && row < this.rows && col >= 0 && col < this.cols && (this.board[row][col] === this.EMPTY);
  }

  getLegalMoves() {
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
    do {
      this.player().move();
      this.show();
    } while(!this.isOver());

    process.stdout.write("\n" + this.status() + "\n\n");
  }
}
module.exports = TicTacToe;
