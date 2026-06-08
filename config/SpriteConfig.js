import Sprite from "../lib/Sprite.js";

export const gokuSpriteConfig = {
    idle: [{ x: 212, y: 130, width: 31, height: 52 }],
    walk: [
        { x: 185, y: 212, width: 38, height: 43 },
        { x: 248, y: 218, width: 47, height: 37 },
    ],
    jump: [
        { x: 68, y: 289, width: 34, height: 50 },
        { x: 113, y: 277, width: 32, height: 60 },
    ],
    fall: [
        { x: 160, y: 278, width: 32, height: 45 },
        { x: 203, y: 279, width: 32, height: 60 },
        { x: 245, y: 276, width: 32, height: 60 },
    ],
    death: [
        { x: 311, y: 719, width: 31, height: 38 },
        { x: 352, y: 731, width: 55, height: 29 },
    ],
    block: [
        { x: 68, y: 363, width: 33, height: 48 },
        { x: 111, y: 363, width: 31, height: 48 },
    ],
    damage: [{ x: 159, y: 710, width: 47, height: 48 }, {}],
    attack: [
        { x: 217, y: 445, width: 39, height: 48 },
        { x: 265, y: 445, width: 43, height: 48 },
        { x: 217, y: 445, width: 39, height: 48 },
        {},
    ],
    special1: [
        { x: 397, y: 931, width: 53, height: 52 },
        { x: 468, y: 926, width: 49, height: 57 },
        { x: 535, y: 922, width: 44, height: 61 },
        { x: 600, y: 905, width: 63, height: 78 },
        { x: 173, y: 1046, width: 32, height: 51 },
        { x: 215, y: 1037, width: 64, height: 61 },
        { x: 412, y: 1006, width: 419, height: 128 },
        {},
    ],
};

export const vegetaSpriteConfig = {
    idle: [{ x: 181, y: 132, width: 23, height: 50 }],
    walk: [
        { x: 123, y: 208, width: 36, height: 43 },
        { x: 193, y: 218, width: 54, height: 33 },
    ],
    jump: [
        { x: 68, y: 280, width: 28, height: 46 },
        { x: 111, y: 274, width: 30, height: 52 },
    ],
    fall: [
        { x: 156, y: 274, width: 32, height: 46 },
        { x: 202, y: 276, width: 29, height: 50 },
        { x: 247, y: 270, width: 26, height: 56 },
    ],
    death: [
        { x: 305, y: 714, width: 31, height: 35 },
        { x: 346, y: 733, width: 53, height: 20 },
    ],
    block: [
        { x: 68, y: 354, width: 28, height: 47 },
        { x: 115, y: 355, width: 26, height: 47 },
    ],
    damage: [{ x: 109, y: 707, width: 41, height: 42 }, {}],
    attack: [
        { x: 204, y: 438, width: 33, height: 44 },
        { x: 247, y: 436, width: 41, height: 46 },
        { x: 296, y: 436, width: 41, height: 46 },
        {},
    ],
    special1: [
        { x: 397, y: 1065, width: 53, height: 48 },
        { x: 468, y: 1060, width: 49, height: 53 },
        { x: 532, y: 1057, width: 44, height: 55 },
        { x: 600, y: 1036, width: 63, height: 77 },
        { x: 264, y: 1522, width: 42, height: 49 },
        { x: 362, y: 1514, width: 68, height: 68 },
        { x: 448, y: 1457, width: 503, height: 181 },
        {},
    ],
};

export function loadFighterSprites(spriteSheet, spriteConfig) {
    const sprites = {};

    for (const [animationName, frames] of Object.entries(spriteConfig)) {
        sprites[animationName] = frames.map(
            (frame) =>
                new Sprite(
                    spriteSheet,
                    frame.x,
                    frame.y,
                    frame.width,
                    frame.height
                )
        );
    }

    return sprites;
}
