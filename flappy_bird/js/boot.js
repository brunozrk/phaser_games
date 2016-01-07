var Boot = function(game) {};

Boot.prototype = {
  create: function(){
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.updateLayout(true);
    this.game.state.start("Preload");
  }
}