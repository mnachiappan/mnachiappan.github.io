function initFlappy(domID){
    var states = { preload: preload,
                    create: create,
                    update: update };

    var xDim = 1400;
    var yDim = 1000;
    var birdieWeight = 650;
    var FLAP = 420;
    var SPEED = 300;

    var game = new Phaser.Game(xDim, yDim, Phaser.AUTO, domID, states);

    var birdie,
        gameStarted,
        gameOver,
        fingerTimer;

    function preload(){
        game.scale.maxWidth = xDim;
        game.scale.maxHeight = yDim;

        //  Then we tell Phaser that we want it to scale up to whatever the browser can handle, but to do it proportionally
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        game.scale.setScreenSize();

        game.load.spritesheet('birdie', 'assets/birdie.png', 48, 24);
        game.load.image('finger', 'assets/finger.png');
    }

    function create(){

        game.physics.startSystem(Phaser.Physics.ARCADE);

        var birdieScale = 3;
        birdie = game.add.sprite(game.width / 6, game.height / 2, 'birdie');
        birdie.anchor.setTo(0.5, 0.5);
        birdie.animations.add('fly', [0, 1, 2, 3], 10, true);
        birdie.scale.setTo(birdieScale, birdieScale);
        game.input.onDown.add(flap);

        fingers = game.add.group();

        // Enable physics on these sprites
        game.physics.enable([birdie, fingers], Phaser.Physics.ARCADE);
        birdie.body.gravity.y = birdieWeight;
        birdie.body.collideWorldBounds = true;

        game.stage.backgroundColor = '#DDEEFF';

        reset();
    }

    function flap(){
        if(!gameStarted){
            beginGame();
        } else if(!gameOver){
            birdie.body.velocity.y = -FLAP;
        } else{
            reset();
        }
    }

    function reset(){
        birdie.animations.play('fly', 15, true); 
        birdie.body.allowGravity = false;
        birdie.reset(game.world.width / 6, game.world.height / 2);
        birdie.angle = 0;
        gameStarted = false;
        gameOver = false;
        fingers.removeAll(true);
    }

    function beginGame(){
        birdie.body.allowGravity = true;
        gameStarted = true;
        fingerTimer = game.time.create(false);
        fingerTimer.loop(1000, spawnFingerPair, this);
        fingerTimer.start();
    }

    function endGame(){
        console.log("executing endGame()");
        fingerTimer.stop();
        birdie.animations.stop('fly');
        gameOver = true;
        birdie.angle = 90;
        birdie.body.velocity.x = 0;
        fingers.setAll('body.velocity.x', 0);
    }

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function spawnFinger(fingerY, flipped){
        var finger = fingers.create(game.world.width, fingerY, 'finger');
        game.physics.enable([finger], Phaser.Physics.ARCADE);
        finger.height = game.world.height;
        finger.body.allowGravity = false;   
        finger.body.velocity.x = -SPEED;
        finger.scale.x = 2;
        if (flipped){
            finger.scale.y = -1;
            finger.body.offset.y = -finger.body.height;
        }
    }

    function spawnFingerPair(){
        console.log("spawnFinger");
        var distance = 500;
        var minFingerHeight = 10;
        var y = getRandomInt(distance + minFingerHeight, game.world.height - minFingerHeight);
        spawnFinger(y, false);
        spawnFinger(y - distance, true);    
    }

    function update(){
        //game.physics.arcade.collide(birdie, fingers, endGame);  
        if(gameStarted && !gameOver){
            var MAX_ANGLE = 60;
            if (birdie.body.velocity.y <= -FLAP){
                birdie.angle = -MAX_ANGLE;
            }else{
                var angle = MAX_ANGLE / FLAP * birdie.body.velocity.y;
                birdie.angle = Math.min(angle, 90);
            }

            if(birdie.body.bottom >= game.world.bounds.bottom){
                endGame();
            }
            game.physics.arcade.overlap(birdie, fingers, endGame);

        }
    }

}