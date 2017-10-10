let Player = require('./player');

class AI extends Player {
  constructor(token, name = 'WOPR') {
    super(token, name);
  }

  move() {
    let ttt = this.ttt;
    let legalMoves = ttt.getLegalMoves();

    let isWinning = (token, row, col) => {
      let winning = false;
      ttt.board[row][col] = token;
      if (ttt.hasWon(token)) {
        winning = true;
      }

      ttt.board[row][col] = ttt.EMPTY;
      return winning;
    };

    //play winning move
    for(let i = 0; i < legalMoves.length; i++) {
      if (isWinning(this.token, legalMoves[i][0], legalMoves[i][1])) {
        return ttt.addToken(this.token, legalMoves[i][0], legalMoves[i][1]);
      }
    }

    //play blocking move
    for(let i = 0; i < legalMoves.length; i++) {
      if (isWinning(ttt.nextPlayer().token, legalMoves[i][0], legalMoves[i][1])) {
        return ttt.addToken(this.token, legalMoves[i][0], legalMoves[i][1]);
      }
    }

    //play the center.
    //TODO: get multiple centers in case of EVENxEVEN board
    if(ttt.isFree(Math.floor(ttt.rows / 2), Math.floor(ttt.cols / 2))) {
      return ttt.addToken(this.token, Math.floor(ttt.rows / 2), Math.floor(ttt.cols / 2));
    }

    //play a random corner
    let corners = legalMoves.filter(move => move.every((m, idx) => {
      return m === [0,0][idx] || m === [2,2][idx] || m === [0, ttt.cols - 1][idx] || m === [0, ttt.cols - 1][idx];
    }));


    if(corners.length > 0) {
      let[row, col] = corners[Math.floor(Math.random() * corners.length)];
      return ttt.addToken(this.token, row, col);
    }

    //play a random legal move
    let[row, col] = legalMoves[Math.floor(Math.random() * legalMoves.length)];
    return ttt.addToken(this.token, row, col);
  }
}

module.exports = AI;
