class Player {
  constructor(token, name = 'Player') {
    this.token = token;
    this.name  = name;
    this.prompt = this.name + ' (' + this.token + '): ';
  }
  move() {
    throw new Error('Unimplemented');
  }
}

module.exports = Player;
