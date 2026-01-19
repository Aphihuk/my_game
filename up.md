# Game Features

## Current Features

### Player
- **Movement**: Physics-based movement using WASD keys with acceleration and friction
- **Sword Attack**: Press spacebar to perform a melee sword attack that damages enemies within range
- **Dash**: Press E to dash in the direction of currently held WASD keys (smooth animation, 5-second cooldown)
- **Health**: 5 hearts that take damage from enemy bullets

### Enemies
- **Spawning**: Enemies spawn every 20 seconds at random locations
- **Movement**: Enemies chase the player
- **Shooting**: Enemies randomly shoot bullets at the player (1% chance per frame)

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
- During sword attack, player becomes ⚔️
- Enemy bullets: ❤️
- Hearts: ❤️ (full), 🤍 (empty)
