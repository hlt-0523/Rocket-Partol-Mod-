// Spaceship prefab
class Spaceship extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, pointValue) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        this.points = pointValue;
        this.moveSpeed = game.settings.spaceshipSpeed;
        this.direction = Math.random() < 0.5 ? 'left' : 'right';
    }

    update() {

        this.setFlipX(this.direction === 'right');
        
        if (this.direction === 'left') {
            this.x -= this.moveSpeed;

            if (this.x < -this.width) {
                this.x = game.config.width;
            }
        } else {
            this.x += this.moveSpeed;

            if (this.x > game.config.width) {
                this.x = -this.width;
            }
        }
    }

    reset() {
        this.x = game.config.width;
    }
}
