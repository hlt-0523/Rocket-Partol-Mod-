class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        // load images/tile sprites
        this.load.image('rocket', './assets/rocket.png');
        this.load.image('spaceship', './assets/spaceship.png');
        this.load.image('starfield', './assets/starfield.png');
        this.load.image('fastSpaceship', './assets/fastSpaceship.png');

        // load spritesheet
        this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
    }

    create() {
        // tile sprite
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0);

        // green UI background
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x00FF00).setOrigin(0, 0);
        this.frameCount = 0;


        this.remainingTime = game.settings.gameTimer / 1000; // initial value, converted from milliseconds to seconds
        this.timeText = this.add.text(20, 20, `Time: ${this.remainingTime}`, { fontSize: '32px', fill: '#fff' });

        
        this.explosionSounds = [
            this.sound.add('explo1'),
            this.sound.add('explo2'),
            this.sound.add('explo3'),
            this.sound.add('explo4')
        ];
        
        
        // white borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0 ,0);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0 ,0);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0 ,0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0 ,0);


        // add Rocket (p1)
        this.p1Rocket = new Rocket(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'rocket').setOrigin(0.5, 0);


        // add Spaceships (x3)
        this.ship01 = new Spaceship(this, game.config.width + borderUISize*6, borderUISize*4, 'spaceship', 0, 30).setOrigin(0, 0);
        this.ship02 = new Spaceship(this, game.config.width + borderUISize*3, borderUISize*5 + borderPadding*2, 'spaceship', 0, 20).setOrigin(0,0);
        this.ship03 = new Spaceship(this, game.config.width, borderUISize*6 + borderPadding*4, 'spaceship', 0, 10).setOrigin(0,0);
        this.fastShip = new FastSpaceship(this, game.config.width, game.config.height/2, 'fastSpaceship', 0, 50).setOrigin(0,0);


        // define keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);


        // animation config
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', { 
                start: 0, 
                end: 9, 
                first: 0
            }),
            frameRate: 30
        });

        let timeConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'center',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 150
        }
        
        // initialize score
        this.p1Score = 0;

        // display score
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, this.p1Score, scoreConfig);

        // set GAME OVER false
        this.gameOver = false;

        //play clock
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or ← to Menu', scoreConfig).setOrigin(0.5);
            this.gameOver = true;
        }, null, this);
    }

    update() {
        this.frameCount += 1;


        // assuming your game is running at 60 frames per second
        if (this.frameCount % 60 === 0) {
            this.remainingTime -= 1;
            this.timeText.setText(`Time: ${this.remainingTime}`);
        }

        // check key input for restart / menu
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            this.scene.restart();
        }
    
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
        }
    
        
        this.starfield.tilePositionX -= 4;
        
        
        if (this.remainingTime <= 0) {
            // end the game
            this.gameOver = true;
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', { fontFamily: 'Courier', fontSize: '28px', color: '#F3B141' }).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or ← to Menu', { fontFamily: 'Courier', fontSize: '28px', color: '#F3B141' }).setOrigin(0.5);
            this.clock.remove(false); // Removes the clock to stop it from triggering its callback
        }
        
  
        if(!this.gameOver) {
            this.p1Rocket.update();
            this.ship01.update();
            this.ship02.update();
            this.ship03.update();
            this.fastShip.update(); // update fast spaceship

            // check collisions for all ships
            if(this.checkCollision(this.p1Rocket, this.fastShip)) {
                this.p1Rocket.reset();
                this.shipExplode(this.fastShip);
            }
            if(this.checkCollision(this.p1Rocket, this.ship03)) {
                this.p1Rocket.reset();
                this.shipExplode(this.ship03);
            }
            if(this.checkCollision(this.p1Rocket, this.ship02)) {
                this.p1Rocket.reset();
                this.shipExplode(this.ship02);
            }
            if(this.checkCollision(this.p1Rocket, this.ship01)) {
                this.p1Rocket.reset();
                this.shipExplode(this.ship01);
            }
        }
    }
    
    checkCollision(rocket, ship) {
        if (rocket.x < ship.x + ship.width && 
            rocket.x + rocket.width > ship.x && 
            rocket.y < ship.y + ship.height &&
            rocket.height + rocket.y > ship. y) {
                return true;
        } else {
            return false;
        }
    }

    shipExplode(ship) {
        // set ship visibility
        ship.alpha = 0;                         
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');             // play explode animation
        boom.on('animationcomplete', () => {    // callback after anim completes
            ship.reset();                         // reset ship position
            ship.alpha = 1;                       // make ship visible again
            boom.destroy();                       // remove explosion sprite
        });
        
        this.p1Score += ship.points;
        this.scoreLeft.text = this.p1Score;
        this.remainingTime += 5; // 
        this.timeText.setText(`Time: ${this.remainingTime}`);
        
        let randomSound = Phaser.Math.RND.pick(this.explosionSounds);
        randomSound.play();

        //this.sound.play('sfx_explosion');
      }
}