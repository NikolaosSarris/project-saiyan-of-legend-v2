import Hitbox from "../../lib/Hitbox";
import Colour from "../enums/Colour";

export interface HitboxOffsets {
    x: number;
    y: number;
    width: number;
    height: number;
}

export default class Move {
    name: string;
    damage: number;
    hitbox: Hitbox;
    hitboxOffsetsRight: Hitbox;
    hitboxOffsetsLeft: Hitbox;

    /**
     * Creates a new Move.
     *
     * @param {string} name - The name of the move.
     * @param {number} damage - The amount of damage this move deals.
     * @param {object} hitboxOffsetsRight - Hitbox offsets when facing right.
     * @param {object} hitboxOffsetsLeft - Hitbox offsets when facing left.
     */
    constructor(name: string, damage: number, hitboxOffsetsRight: HitboxOffsets, hitboxOffsetsLeft: HitboxOffsets) {
        this.name = name;
        this.damage = damage;

        //Stores the hitbox and its offsets
        this.hitbox = new Hitbox(0, 0, 0, 0, Colour.Blue);
        this.hitboxOffsetsRight = new Hitbox(
            hitboxOffsetsRight.x,
            hitboxOffsetsRight.y,
            hitboxOffsetsRight.width,
            hitboxOffsetsRight.height,
            Colour.Blue
        );
        this.hitboxOffsetsLeft = new Hitbox(
            hitboxOffsetsLeft.x,
            hitboxOffsetsLeft.y,
            hitboxOffsetsLeft.width,
            hitboxOffsetsLeft.height,
            Colour.Blue
        );
    }

    /**
     * Gets the hitbox offset for the given facing direction.
     *
     * @param {boolean} isFacingRight - True if the fighter is facing right, false if facing left.
     * @returns {Hitbox} - The hitbox offset for the given facing direction.
     */
    getHitboxOffset(isFacingRight: boolean): Hitbox {
        return isFacingRight ? this.hitboxOffsetsRight : this.hitboxOffsetsLeft;
    }
}
