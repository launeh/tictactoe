let clear     = require('clear');
let readline  = require('readline-sync');
let TicTacToe = require('./tictactoe.js');
let Human     = require('./human');
let AI        = require('./ai');

process.stdout.write("TicTacToe\n\n");

if('n' === readline.question("Shall we play a game (Y/N)? ").toLowerCase().trim()) {
  process.exit();
}

let numPlayers = parseInt(readline.question("How many players? "));
numPlayers = isNaN(numPlayers) ? 0 : numPlayers;

switch(numPlayers) {
  case 0:
  new TicTacToe().addPlayers().play();
  break;
case 1:
  new TicTacToe().addPlayers([new Human('X', 'David'), new AI('O', 'WOPR')]).play();
  break;
case 2:
  new TicTacToe().addPlayers([new Human('X', 'David'), new Human('O', 'Jennifer')]).play();
  break;
default:
  process.stdout.write("\nMax 2 players\n");
  break;
}
