var Main = function(game) {};

Main.prototype = {
  createPlayer: function() {
    //Add the player to the game by creating a new sprite
    this.player = this.game.add.sprite(this.game.world.centerX / 2, this.game.world.centerY, 'player');

    //Set the players anchor point to be in the middle horizontally
    this.player.anchor.setTo(0.5, 0.5);

    //Enable physics on the player
    this.game.physics.arcade.enable(this.player);

    //Make the player fall by applying gravity
    this.player.body.gravity.y = 3000;

    //Make the player collide with the game boundaries
    this.player.body.collideWorldBounds = true;

    //This means the players velocity will be unaffected by collisions
    this.player.body.immovable = true;
  },

  create: function() {
    //Enable cursor keys so we can create some controls
    // this.cursors = this.game.input.keyboard.createCursorKeys();

    //Set the speed for the platforms
    this.tileSpeed = -450;

    //Set the initial score
    this.score = 0;

    //Get the dimensions of the tile we are using
    this.tileWidth = this.game.cache.getImage('tile').width;
    this.tileHeight = this.game.cache.getImage('tile').height;

    //Set the background colour to blue
    this.game.stage.backgroundColor = '479cde';

    //Enable the Arcade physics system
    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    //Add the player to the screen
    this.createPlayer();

    //Add a platforms group to hold all of our tiles, and create a bunch of them
    this.platforms = this.game.add.group();
    this.platforms.enableBody = true;
    this.platforms.createMultiple(50, 'tile');

    this.breakables = this.game.add.group();
    this.breakables.enableBody = true;
    this.breakables.createMultiple(20, 'tile2');

    //Add an initial platform
    // this.addPlatform();

    //Add a platform every 3 seconds
    this.timer = game.time.events.loop(3000, this.addPlatform, this);

    //Add particle emitter for death animation
    this.emitter = game.add.emitter(0, 0, 20);
    this.emitter.makeParticles('explode');
    this.emitter.gravity = 200;

    this.createScore();

    this.game.input.onTap.add(this.jump, this);
  },

  jump: function(e, position) {
    this.player.body.velocity.y -= 1500;
  },

  update: function() {
    //Make the sprite jump when the up key is pushed
    // if(this.cursors.up.isDown) {
      // this.player.body.velocity.y -= 300;
    // }

    //Make the sprite collide with the ground layer
    this.game.physics.arcade.overlap(this.player, this.platforms, this.gameOver, null, this);
    this.game.physics.arcade.collide(this.player, this.breakables, this.collideTile, null, this);
    this.game.physics.arcade.collide(this.breakables, this.platforms);
  },

  gameOver: function(){
    this.particleBurst(this.player.body.position.x + (this.player.body.width / 2), this.player.body.position.y + (this.player.body.height / 2));
    this.player.kill();

    //Wait a little bit before restarting game
    this.game.time.events.add(1000, function(){
        this.game.state.start('GameTitle');
    }, this);
  },

  addTile: function(x, y, immovable){
    //Get a tile that is not currently on screen
    if(immovable){
      var tile = this.platforms.getFirstDead();
    } else {
      var tile = this.breakables.getFirstDead();
    }

    //Reset it to the specified coordinates
    tile.body.gravity.y = 0;
    tile.reset(x, y);
    tile.body.velocity.x = this.tileSpeed;
    tile.body.immovable = immovable;

    //When the tile leaves the screen, kill it
    tile.checkWorldBounds = true;
    tile.outOfBoundsKill = true;
  },

  addPlatform: function(){
    this.incrementScore();

    //Speed up the game to make it harder
    this.tileSpeed -= 40;

    //Work out how many tiles we need to fit across the whole screen
    var tilesNeeded = Math.ceil(this.game.world.height / this.tileHeight);

    //Add a hole randomly somewhere
    var hole = Math.floor(Math.random() * (tilesNeeded - 5)) + 1;

    //Keep creating tiles next to each other until we have an entire row
    //Don't add tiles where the random hole is
    for (var i = 0; i < tilesNeeded; i++){
      if (i != hole && i != hole + 1 && i != hole + 2 && i != hole + 3  && i != hole + 4  && i != hole + 5){
          this.addTile(this.game.world.width - this.tileWidth, i * this.tileHeight, true);
      } else {
          this.addTile(this.game.world.width - this.tileWidth, i * this.tileHeight, false);
      }
    }
  },

  collideTile: function(player, tile){
    tile.body.gravity.y = 2000;
  },

  particleBurst: function(x, y){
    this.emitter.x = x;
    this.emitter.y = y;

    this.emitter.start(true, 2000, null, 20);
  },

  createScore: function(){
    var scoreFont = "100px Arial";

    this.scoreLabel = this.game.add.text((this.game.world.centerX), 100, "0", {font: scoreFont, fill: "#fff"});
    this.scoreLabel.anchor.setTo(0.5, 0.5);
    this.scoreLabel.align = 'center';

  },

  incrementScore: function(){
    this.score += 1;
    this.scoreLabel.text = this.score;
  },
};