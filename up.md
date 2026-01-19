# Game Features

## Current Features

### Player
- **Movement**: Physics-based movement using WASD keys with acceleration and friction
- **Sword Attack**: Press spacebar to perform a melee sword attack with animated swing that damages enemies within range
- **Dash**: Press E to dash in the direction of currently held WASD keys (smooth animation, 5-second cooldown)
- **Health**: 5 hearts that take damage from enemy bullets

### Enemies
- **Spawning**: Normal enemies spawn every 20 seconds at random locations
- **Movement**: Enemies chase the player
- **Shooting**: Enemies randomly shoot bullets at the player (1% chance per frame)

### Boss
- **Spawning**: Boss spawns every 40 seconds from screen edges
- **Appearance**: Large ogre emoji (👹) with 120 pixel size
- **Health**: 10 HP (requires multiple sword hits to defeat)
- **Movement**: Slower than normal enemies (speed 0.8)
- **Behavior**: Only one boss can exist at a time

### Game Mechanics
- **Collision Detection**: Bullets damage player/enemies on contact
- **Boundaries**: Player and bullets are clamped to canvas boundaries
- **Sounds**: Movement, shooting, hit, and game over sounds
- **Game Over**: When all hearts are lost, game over screen appears

### Controls
- **WASD**: Move player
- **E**: Dash in direction of held WASD keys
- **Spacebar**: Sword attack (melee)

### Visuals
- Player emoji changes based on movement direction
- During dash, player becomes 🚀
- During sword attack, animated swing (⚔️🗡️⚔️🗡️⚔️)
- Normal enemies: 👻
- Boss enemies: 👹 (large size)
- Enemy bullets: ❤️
- Hearts: ❤️ (full), 🤍 (empty)