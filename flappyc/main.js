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
        clouds,
        gameStarted,
        gameOver,
        fingerTimer,
        cloudTimer,
        score,
        scoreText,
        invisibles,
        bioText;
    var bioIndex = 0;

    var textStyle = { font: "65px Arial", fill: "#ff0044", align: "center" };

    var bio = [
                "Hi, I'm Meyyappan",
                "I study CS at UWaterloo",
                "I love to code",               
                "I made this using Phaser",
                "This game is on Github",
                "So you can contribute too!",
                "Have fun!"
                ];
    bio = [""];

    function preload(){
        game.scale.maxWidth = xDim;
        game.scale.maxHeight = yDim;

        //  Then we tell Phaser that we want it to scale up to whatever the browser can handle, but to do it proportionally
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        game.scale.setScreenSize();

        //game.load.spritesheet('birdie', 'assets/birdie.png', 48, 24);
        game.load.spritesheet('birdie', 'assets/santa2.png', 95, 75);
        game.load.spritesheet('clouds', 'assets/clouds.png', 128, 64);
        game.load.image('finger', 'assets/brick.jpg');
    }

    function create(){

        game.physics.startSystem(Phaser.Physics.ARCADE);

        clouds = game.add.group();
        cloudTimer = game.time.create(false);
        cloudTimer.loop(3000, spawnCloud, this);
        cloudTimer.start();

        var birdieScale = 1;
        birdie = game.add.sprite(game.width / 6, game.height / 2, 'birdie');
        birdie.anchor.setTo(0.5, 0.5);
        //birdie.animations.add('fly', [0, 1, 2, 3], 10, true);
        birdie.animations.add('fly', [0,1,2], 10, true);
        birdie.scale.setTo(birdieScale, birdieScale);
        game.input.onDown.add(flap);

        fingers = game.add.group();

        invisibles = game.add.group();

        // Enable physics on these sprites
        game.physics.enable([birdie, fingers], Phaser.Physics.ARCADE);
        birdie.body.gravity.y = birdieWeight;
        birdie.body.collideWorldBounds = true;

        game.stage.backgroundColor = '#DDEEFF';
        
        scoreText = game.add.text(game.world.centerX, 0, "0", textStyle);
        bioText = game.add.text(game.world.centerX, 50, "", textStyle);
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
        invisibles.removeAll(true);
        score = 0;
        scoreText.text = score;
        bioText.text = "";
    }

    function beginGame(){
        birdie.body.allowGravity = true;
        gameStarted = true;
        fingerTimer = game.time.create(false);
        fingerTimer.loop(1450, spawnFingerPair, this);
        fingerTimer.start();
        score = 0;
        scoreText.text = score;
        bioText.text = "";
    }

    function endGame(){
        console.log("executing endGame()");
        fingerTimer.stop();
        birdie.animations.stop('fly');
        gameOver = true;
        birdie.angle = 90;
        birdie.body.velocity.x = 0;
        fingers.setAll('body.velocity.x', 0);
        bioText.text = bio[bioIndex];
        bioIndex = Math.min(bioIndex + 1, bio.length - 1);
    }

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function spawnCloud(){
        var cloudY = Math.random() * game.world.height / 2;
        var cloud = clouds.create(game.world.width, cloudY, 'clouds', Math.floor(4 * Math.random()));
        game.physics.enable([cloud], Phaser.Physics.ARCADE);
        var cloudScale = 2 + 2 * Math.random();
        cloud.scale.setTo(cloudScale, cloudScale);
        cloud.alpha = 2 / cloudScale;
        cloud.body.allowGravity = false;
        cloud.body.velocity.x = -SPEED / cloudScale;
        return cloud;
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
        return finger;
    }

    function spawnFingerPair(){
        console.log("spawnFinger");
        var distance = 240;
        var minFingerHeight = 250;
        var y = getRandomInt(distance + minFingerHeight, game.world.height - minFingerHeight);
        var bottomFinger = spawnFinger(y, false);
        spawnFinger(y - distance, true); 
        var invis = invisibles.create(bottomFinger.x + bottomFinger.width, 0);
        invis.width = 2;
        invis.height = game.world.height;
        game.physics.enable([invis], Phaser.Physics.ARCADE);
        invis.body.allowGravity = false;
        invis.body.velocity.x = -SPEED;
    }

    function incrementScore(_, invis){
        score += 1;
        scoreText.text = score;
        invisibles.remove(invis);
        console.log (score);
    }

    function update(){
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
            game.physics.arcade.overlap(birdie, invisibles, incrementScore);
        }
    }

}