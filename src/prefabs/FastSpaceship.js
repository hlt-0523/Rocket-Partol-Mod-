class FastSpaceship extends Spaceship {
    constructor(scene, x, y, texture, frame, pointValue) {
        super(scene, x, y, texture, frame, pointValue);

        this.moveSpeed = 4; // Adjust this value for faster movement
    }

    update() {
        // Move spaceship left or right
        if (this.moveDirection === 'left') {
            this.x -= this.moveSpeed;
        } else {
            this.x += this.moveSpeed;
        }
        
        // Wraparound screen bounds
        if (this.x <= 0 - this.width) {
            this.reset();
        } else if (this.x >= game.config.width) {
            this.reset();
        }
    }

    // Override reset method if necessary
    reset() {
        super.reset(); // Call parent class reset
        this.moveDirection = Math.random() < 0.5 ? 'left' : 'right'; // Randomize move direction
    }
}
