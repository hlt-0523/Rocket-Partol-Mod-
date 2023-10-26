// Spaceship prefab
class Spaceship extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, pointValue) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        this.points = pointValue;
        this.moveSpeed = game.settings.spaceshipSpeed;
        this.direction = Math.random() < 0.5 ? 'left' : 'right';

        // Set the flip based on initial direction
        this.updateFlip();
    }

    update() {
        // Set the flip based on direction
        this.setFlipX(this.direction === 'right');
        
        if (this.direction === 'left') {
            this.x -= this.moveSpeed;

            if (this.x < -this.width) {
                this.x = game.config.width;
                this.direction = Math.random() < 0.5 ? 'left' : 'right';
            }
        } else {
            this.x += this.moveSpeed;

            if (this.x > game.config.width) {
                this.x = -this.width;
                this.direction = Math.random() < 0.5 ? 'left' : 'right';
            }
        }
    }

    reset() {
        this.x = game.config.width;
        this.direction = Math.random() < 0.5 ? 'left' : 'right';
        this.updateFlip();
    }

    updateFlip() {
        if (this.direction === 'right') {
            this.scaleX = -1;  // flip the sprite to the right
        } else {
            this.scaleX = 1;   // original scale for left direction
        }
    }
    
}
