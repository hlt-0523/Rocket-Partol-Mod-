//I am Lingtian HE
//mod title UFO with Upsets(UwU)
//I think I spent at least 8 hour for this project (3 hour for the flip BUG)
/*
1. Create a new enemy Spaceship type that's smaller, moves faster, and is worth more points:

2. Implement a new timing/scoring mechanism that adds time to the clock for successful hits:
 
3. Randomize each spaceship's movement direction at the start of each play:
  
4. Create 4 new explosion sound effects and randomize which one plays on impact:
 
5. Create a new title screen:
 
6. Display the time remaining (in seconds) on the screen:


in corresponding:
Create a new enemy Spaceship type (w/ new artwork) that's smaller, moves faster, and is worth more points (5)
Implement a new timing/scoring mechanism that adds time to the clock for successful hits (5)
Randomize each spaceship's movement direction at the start of each play (1)
Create 4 new explosion sound effects and randomize which one plays on impact (3)
Create a new title screen (e.g., new artwork, typography, layout) (3)
Display the time remaining (in seconds) on the screen (3)

*/



let config = {
  type: Phaser.CANVAS,
  width: 640,
  height: 480,
  scene: [ Menu, Play ]
}

let game = new Phaser.Game(config);
// set UI sizes
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;
// reserve keyboard variables
let keyF, keyR, keyLEFT, keyRIGHT;