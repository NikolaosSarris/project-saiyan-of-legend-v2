# Dragon Ball Fighting Game - Project Summary

## 📋 Project Overview

A 2-player Dragon Ball Z fighting game built with vanilla JavaScript and HTML5 Canvas. Features two legendary Saiyans (Goku and Vegeta) battling with melee attacks, special moves, blocking mechanics, and win tracking across multiple rounds.

**Course:** JAC-CS-Game-Programming-F25  
**Framework:** Vanilla JavaScript, HTML5 Canvas  
**Architecture:** State Machine Pattern, Factory Pattern, Object-Oriented Design

---

## 🎮 Core Features

### Gameplay Mechanics

- **2-Player Local Multiplayer** - WASD vs IJKL control schemes
- **Fighter States** - Idle, Walk, Jump, Fall, Attack, Block, Special Moves, Taking Damage, Death
- **Health System** - 100 HP with Pokemon-style animated health bar drain
- **Combat System** - Melee attacks (10 damage), Special beam attacks (30 damage), blocking (50% damage reduction)
- **Win Tracking** - Persistent win counts across rematches using sessionStorage
- **Invincibility Frames** - 1 second after taking damage
- **Knockback System** - Players pushed back when hit

### Visual & Audio

- **Sprite Animations** - Character-specific sprite sheets for all states
- **Sound Effects** - Hit sounds, block sounds, special move audio, background music
- **UI Screens** - Title screen, controls screen, gameplay, victory screen
- **Health Bars** - Color-coded (green > 50%, yellow > 25%, red < 25%) with smooth tweening
- **Screen Transitions** - Fade-in animations using tweening system

---

## 🏗️ Architecture & Design Patterns

### 1. **State Machine Pattern** (Polymorphism)

**Fighter States:**

```javascript
FighterState (base class)
├── FighterIdlingState
├── FighterWalkingState
├── FighterJumpingState
├── FighterFallingState
├── FighterAttackingState
├── FighterBlockingState
├── FighterSpecial1State
├── FighterTakingDamageState
└── FighterDyingState
```

**Game States:**

```javascript
State (base class)
├── TitleScreenState
├── ControlsScreenState
├── PlayState
└── VictoryScreenState
```

**Polymorphic Behavior:**

```javascript
// Same method call, different behavior based on current state
fighter.stateMachine.currentState.update(dt);
stateMachine.currentState.render(context);
```

### 2. **Factory Pattern** (Creational Design Pattern)

**MoveFactory** creates move objects with encapsulated damage and hitbox data:

```javascript
class MoveFactory {
    static createPunch(width, height) { ... }
    static createKamehameha(width, height) { ... }
    static createJab(width, height) { ... }
    static createKick(width, height) { ... }
}

// Usage
this.moves = {
    punch: MoveFactory.createPunch(width, height),
    kamehameha: MoveFactory.createKamehameha(width, height)
};
```

**Benefits:**

- Centralized move creation
- Easy to add new moves
- Consistent move properties
- No hardcoded damage values scattered throughout code

### 3. **Entity-Component System**

```javascript
Entity (base class)
└── Fighter
    ├── Position, Velocity, Dimensions
    ├── Health, Damage, Invincibility
    ├── StateMachine
    ├── Animations
    ├── Moves (from Factory)
    └── Hitboxes (Body, Attack)
```

---

## 🎯 Key Technical Implementations

### Hitbox System (Zelda-Style)

**Two Hitbox Types:**

1. **Body Hitbox (Hurtbox)** - Where fighter can BE HIT
2. **Attack Hitbox** - Stored in Move objects, positioned based on facing direction

```javascript
// Move contains hitbox data
class Move {
    constructor(name, damage, hitboxRight, hitboxLeft) {
        this.hitboxRight = new Hitbox(...);
        this.hitboxLeft = new Hitbox(...);
    }

    getHitboxOffset(facingRight) {
        return facingRight ? this.hitboxRight : this.hitboxLeft;
    }
}

// Fighter uses move's hitbox
fighter.currentMove.getHitboxOffset(fighter.facingRight);
```

### Health Bar Tweening (Pokemon-Style)

**Problem:** Tweening Fighter object causes circular dependency errors  
**Solution:** Tween inside HealthBar class itself

```javascript
class HealthBar {
    update(newValue) {
        if (this.currentValue !== targetValue) {
            timer.tween(
                this,
                { displayValue: targetValue },
                0.5,
                Easing.linear,
            );
        }
    }
}

// PlayState just updates health instantly
victim.health -= damage;

// Health bar tweens itself when it detects change
healthBar.update(victim.health);
```

### Sprite Dimension Management

**Challenge:** Different animation frames have different sizes  
**Solution:** Dynamic dimension updates per frame

```javascript
// Fighter tracks base dimensions from idle sprite
this.baseDimensions = new Vector(
    spriteConfig.idle[0].width,
    spriteConfig.idle[0].height
);

// Update dimensions each frame based on current animation
setDimensionsForAnimation(animationName, frame) {
    const frames = this.spriteConfig[animationName];
    this.dimensions.x = frames[frame].width;
    this.dimensions.y = frames[frame].height;
}

// States call this every frame
this.fighter.setDimensionsForAnimation("attack", currentFrame);
```

### Special Move Ground Anchoring

**Problem:** Kamehameha sprite (frame 6) is 128px tall vs normal 52px - fighter clips through ground  
**Solution:** Anchor bottom of sprite to ground

```javascript
enter() {
    // Save ground position
    this.groundY = this.fighter.position.y + this.fighter.dimensions.y;
}

update(dt) {
    // Update dimensions
    this.fighter.setDimensionsForAnimation("special1", currentFrame);

    // Keep bottom anchored
    this.fighter.position.y = this.groundY - this.fighter.dimensions.y;
}
```

### Persistence System (SessionStorage)

**GameStateManager** saves/loads game state across page reloads:

```javascript
// Saves fighter positions, health, wins
GameManager.savePlayState(player1, player2);

// Saves wins separately for cross-state persistence
GameManager.saveWins(player1Wins, player2Wins);

// Loads on page reload
const savedState = GameManager.load();
```

**What Persists:**

- Fighter positions and velocities
- Health values
- Win counts
- Current game state

**What Doesn't Persist:**

- Clears when browser tab closes (sessionStorage)
- Intentionally cleared when starting new game from title

---

## 🎨 Asset Configuration

### Sprite Configuration

```javascript
export const gokuSpriteConfig = {
    idle: [{ x: 212, y: 130, width: 31, height: 52 }],
    walk: [
        { x: 185, y: 212, width: 38, height: 43 },
        { x: 248, y: 218, width: 47, height: 37 }
    ],
    attack: [...],
    special1: [...],  // Kamehameha
    death: [...],
    block: [...],
    damage: [...]
};
```

### Sound Configuration

```json
{
    "sounds": [
        {
            "name": "main_theme",
            "path": "./assets/sounds/main_theme.mp3",
            "volume": 0.2,
            "loop": true
        },
        {
            "name": "battle_theme",
            "path": "./assets/sounds/battle_theme.mp3",
            "volume": 0.2,
            "loop": true
        },
        {
            "name": "hit",
            "path": "./assets/sounds/hit.mp3",
            "size": 4,
            "volume": 1
        },
        {
            "name": "kamehameha",
            "path": "./assets/sounds/kamehameha.mp3",
            "size": 2,
            "volume": 1
        }
    ]
}
```

---

## 🎮 Control Scheme

### Player 1 (Goku)

- **W** - Jump
- **A/D** - Move Left/Right
- **S** - Block
- **E** - Attack (Punch)
- **1** - Special 1 (Kamehameha)

### Player 2 (Vegeta)

- **I** - Jump
- **J/L** - Move Left/Right
- **K** - Block
- **O** - Attack (Punch)
- **7** - Special 1 (Final Flash)

---

## 📊 Combat System Details

### Damage Values

- **Punch:** 10 damage
- **Kamehameha/Final Flash:** 30 damage
- **Blocking:** 50% damage reduction

### State Transitions

```
Idle → Walk (movement keys)
Idle → Jump (jump key)
Idle → Attack (attack key)
Idle → Block (block key held)
Idle → Special1 (special key)

Any State → TakingDamage (when hit)
TakingDamage → Idle (animation complete)

Any State → Dying (health reaches 0)
```

### Invincibility System

- **Duration:** 1 second after taking damage
- **Visual Feedback:** Fighter flashes (alpha: 1.0 ↔ 0.3 every 0.05s)
- **Purpose:** Prevent instant consecutive hits

---

## 🔧 Technical Challenges Solved

### 1. Circular Dependency in Tweening

**Problem:** `timer.tween(fighter, ...)` caused `JSON.stringify` circular reference error  
**Solution:** Modified Timer.js to only copy property values, not entire object

```javascript
// Before (caused error)
const startingValues = JSON.parse(JSON.stringify(object));

// After (works)
const startingValues = {};
keys.forEach((key) => {
    startingValues[key] = object[key];
});
```

### 2. Wins Resetting on Rematch

**Problem:** New Fighter objects created each match → wins reset to 0  
**Solution:** Separate wins storage in GameManager.saveWins()

```javascript
// Load wins from storage when creating new fighters
const savedWins = GameManager.loadWins();
this.player1.wins = savedWins.player1Wins;
```

### 3. Sound Playing from Wrong Pool Index

**Problem:** `stop()` in SoundPool stopped wrong sound (currentSound already incremented)  
**Solution:** Stop ALL sounds in pool

```javascript
stop() {
    this.pool.forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
    });
}
```

### 4. Double Tweening Health Bars

**Problem:** Both PlayState and HealthBar tweening → redundant animations  
**Solution:** Only tween in HealthBar (no circular dependency there)

```javascript
// PlayState just updates health instantly
victim.health -= damage;

// HealthBar detects change and tweens displayValue
healthBar.update(victim.health);
```

---

## 📁 Project Structure

```
project/
├── assets/
│   ├── images/
│   │   ├── goku.png
│   │   ├── vegeta.png
│   │   └── background.png
│   ├── sounds/
│   │   ├── main_theme.mp3
│   │   ├── battle_theme.mp3
│   │   ├── hit.mp3
│   │   └── kamehameha.mp3
│   └── fonts/
│       └── PressStart2P.ttf
├── config/
│   ├── assets.json
│   ├── tilemap.json
│   └── SpriteConfig.js
├── lib/
│   ├── Animation.js
│   ├── Easing.js
│   ├── Fonts.js
│   ├── Game.js
│   ├── Hitbox.js
│   ├── Images.js
│   ├── Input.js
│   ├── SoundPool.js
│   ├── Sounds.js
│   ├── Sprite.js
│   ├── StateMachine.js
│   ├── Timer.js
│   └── Vector.js
├── src/
│   ├── entities/
│   │   ├── Entity.js
│   │   ├── Fighter.js
│   │   ├── Move.js
│   │   └── MoveFactory.js
│   ├── enums/
│   │   ├── Colour.js
│   │   ├── FighterStateName.js
│   │   ├── GameStateName.js
│   │   ├── ImageName.js
│   │   └── SoundName.js
│   ├── services/
│   │   ├── GameManager.js
│   │   ├── Map.js
│   │   └── Tile.js
│   ├── states/
│   │   ├── fighter/
│   │   │   ├── FighterState.js
│   │   │   ├── FighterIdlingState.js
│   │   │   ├── FighterWalkingState.js
│   │   │   ├── FighterJumpingState.js
│   │   │   ├── FighterFallingState.js
│   │   │   ├── FighterAttackingState.js
│   │   │   ├── FighterBlockingState.js
│   │   │   ├── FighterSpecial1State.js
│   │   │   ├── FighterTakingDamageState.js
│   │   │   └── FighterDyingState.js
│   │   └── game/
│   │       ├── TitleScreenState.js
│   │       ├── ControlsScreenState.js
│   │       ├── PlayState.js
│   │       └── VictoryScreenState.js
│   ├── user-interface/
│   │   └── HealthBar.js
│   ├── globals.js
│   └── main.js
└── index.html
```

---

## 🎓 Course Requirements Met

### Design Patterns

✅ **Factory Pattern** - MoveFactory creates move objects  
✅ **State Pattern** - Fighter states and game states (polymorphism)  
✅ **Singleton Pattern** - Global managers (sounds, images, timer, stateMachine)

### OOP Principles

✅ **Inheritance** - State hierarchies, Entity → Fighter  
✅ **Polymorphism** - State machine calls (update, render, enter, exit)  
✅ **Encapsulation** - Move data, hitboxes, health management  
✅ **Abstraction** - Base State and FighterState classes

### Technical Features

✅ **Canvas Rendering** - Custom sprite rendering, UI, animations  
✅ **Game Loop** - Timer-based update cycle with delta time  
✅ **Input Handling** - Keyboard input for 2 players  
✅ **Animation System** - Sprite sheet animations with frame timing  
✅ **Audio System** - Sound pools for simultaneous sound playback  
✅ **Collision Detection** - Hitbox-based combat system  
✅ **Persistence** - SessionStorage for save/load functionality

---

## 🚀 Game Flow

```
1. Launch → TitleScreenState
   ├── Press Enter → PlayState (new game)
   └── Press C → ControlsScreenState → Press Enter → PlayState

2. PlayState (Battle)
   ├── Fight until one player's health reaches 0
   ├── Winner's win count incremented
   └── Transition to VictoryScreenState

3. VictoryScreenState
   ├── Shows winner name and win counts
   ├── Press F → PlayState (rematch, wins persist)
   └── Press Enter → TitleScreenState (wins persist until new game)

4. Page Reload
   ├── Loads saved state from sessionStorage
   └── Resumes exactly where left off (position, health, wins)

5. Browser Tab Close
   └── All data cleared (sessionStorage cleared)
```

---

## 💡 Design Decisions

### Why Pokemon-Style Health Drain?

- Provides visual feedback for damage
- Builds tension when health is low
- Industry-standard pattern (Pokemon, Street Fighter, etc.)

### Why Factory Pattern for Moves?

- Satisfies course rubric requirement
- Makes adding new moves trivial
- Centralizes move balance (damage, hitboxes)
- Eliminates hardcoded values

### Why State Pattern for Everything?

- Clean separation of concerns
- Each state manages its own logic
- Easy to add new states
- Demonstrates polymorphism clearly

### Why SessionStorage over LocalStorage?

- Fighting games are session-based
- Don't want stale saves from weeks ago
- Fresh start each time you open the game
- Still persists during page reloads for debugging

---

## 🐛 Known Limitations

1. **No AI** - 2-player only (intentional design choice)
2. **Single Stage** - One background/map
3. **Limited Special Moves** - One special per character
4. **No Combo System** - Individual attacks only
5. **No Mobile Support** - Keyboard controls only

---

## 🎯 Future Enhancements (If Continued)

1. **Additional Moves** - Use factory to add kicks, uppercuts, energy blasts
2. **Combo System** - Chain attacks for higher damage
3. **Character Select** - Choose from multiple fighters
4. **Stage Select** - Multiple backgrounds
5. **Power-Up System** - Temporary buffs (speed, damage, defense)
6. **Round System** - Best of 3/5 rounds
7. **Tournament Mode** - Bracket-style progression
8. **Replay System** - Save and replay matches
9. **Training Mode** - Practice combos and moves
10. **Network Multiplayer** - Online battles

---

## 📚 Technologies Used

- **JavaScript (ES6+)** - Classes, modules, async/await
- **HTML5 Canvas** - 2D rendering
- **SessionStorage API** - State persistence
- **Web Audio API** - Sound playback
- **CSS** - Basic styling and canvas scaling

---

## 📝 Credits

- Sprites: spriters-resource.com
- Backgrounds: open3dlab.com
- Sounds: freesound.org, opengameart.org
- Font: Google Fonts (Press Start 2P)
