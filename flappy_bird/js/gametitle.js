var GameTitle = function(game){};

GameTitle.prototype = {
  create: function(){
    this.game.stage.backgroundColor = '479cde'

    this.startLabel = this.game.add.text(this.game.world.centerX, 100, 'Tap to start!', {font: '100px Arial'});
    this.startLabel.anchor.setTo(0.5, 0.5);
    this.startLabel.align = 'center'

    this.game.input.onTap.add(this.startGame);
  },

  startGame: function(){
    this.game.state.start("Main");
  }
}