import State from "../../../lib/State.js";
import { FighterConfig } from "../../../config/FighterConfig.js";
import { input } from "../../globals.js";
import Tile from "../../services/Tile.js";
import CollisionDetector from "../../services/CollisionDetector.js";
import { PlayerControls } from "../../enums/PlayerControls.js";

export default class FighterState extends State {
    /**
     * Constructor for the FighterState class.
     *
     * @param fighter - The fighter instance.
     */
    constructor(fighter) {
        super();
        this.fighter = fighter;
        this.collisionDetector = new CollisionDetector(fighter.map);

        this.controls = PlayerControls[fighter.playerNumber];
    }

    /**
     * Updates the fighter state.
     *
     * @param {number} dt - Delta time.
     */
    update(dt) {
        this.applyGravity(dt);
        this.updatePosition(dt);
        this.fighter.currentAnimation.update(dt);
    }

    /**
     * Renders the fighter on the canvas.
     *
     * @param {CanvasRenderingContext2D} context - The 2D rendering context of the canvas.
     */
    render(context) {
        super.render();

        context.save();

        //Handles fighter orientation
        if (!this.fighter.isFacingRight) {
            //If facing left, flip the sprite horizontally
            context.scale(-1, 1);
            //Adjusts position to account for the flip
            context.translate(
                Math.floor(
                    -this.fighter.position.x - this.fighter.dimensions.x
                ),
                Math.floor(this.fighter.position.y)
            );
        } else {
            //If facing right, just translate to the fighter's position
            context.translate(
                Math.floor(this.fighter.position.x),
                Math.floor(this.fighter.position.y)
            );
        }

        //Renders the current frame of the fighter's animation
        this.fighter.currentAnimation.getCurrentFrame().render(0, 0);

        context.restore();
    }

    /**
     * Gets the tiles that the fighter is colliding with.
     *
     * @param {number} left - Leftmost tile x-coordinate.
     * @param {number} top - Topmost tile y-coordinate.
     * @param {number} right - Rightmost tile x-coordinate.
     * @param {number} bottom - Bottommost tile y-coordinate.
     * @returns {Array} Array of colliding tile coordinates.
     */
    getCollidingTiles(left, top, right, bottom) {
        const collidingTiles = [];
        for (let y = top; y <= bottom; y++) {
            for (let x = left; x <= right; x++) {
                if (this.fighter.map.isSolidTileAt(x, y)) {
                    collidingTiles.push({ x, y });
                }
            }
        }
        return collidingTiles;
    }

    /**
     * Handles horizontal movement of the fighter.
     */
    handleHorizontalMovement() {
        if (
            input.isKeyHeld(this.controls.moveLeft) &&
            input.isKeyHeld(this.controls.moveRight)
        ) {
            this.slowDown();
        } else if (input.isKeyHeld(this.controls.moveLeft)) {
            this.moveLeft();
            this.fighter.isFacingRight = false;
        } else if (input.isKeyHeld(this.controls.moveRight)) {
            this.moveRight();
            this.fighter.isFacingRight = true;
        } else {
            this.slowDown();
        }

        //Sets speed to zero if it's close to zero to stop the fighter
        if (Math.abs(this.fighter.velocity.x) < 0.1)
            this.fighter.velocity.x = 0;
    }

    /**
     * Increases the fighter's horizontal velocity to the right by the acceleration value.
     */
    moveRight() {
        this.fighter.velocity.x = Math.min(
            this.fighter.velocity.x + FighterConfig.acceleration,
            FighterConfig.maxSpeed
        );
    }

    /**
     * Decreases the fighter's horizontal velocity to the left by the acceleration value.
     */
    moveLeft() {
        this.fighter.velocity.x = Math.max(
            this.fighter.velocity.x - FighterConfig.acceleration,
            -FighterConfig.maxSpeed
        );
    }

    /**
     * Slows down the fighter's horizontal movement by applying deceleration to the fighter's horizontal velocity.
     */
    slowDown() {
        if (this.fighter.velocity.x > 0) {
            this.fighter.velocity.x = Math.max(
                0,
                this.fighter.velocity.x - FighterConfig.deceleration
            );
        } else if (this.fighter.velocity.x < 0) {
            this.fighter.velocity.x = Math.min(
                0,
                this.fighter.velocity.x + FighterConfig.deceleration
            );
        }
    }

    /**
     * Applies gravity to the fighter.
     *
     * @param {number} dt - Delta time (time since last update).
     */
    applyGravity(dt) {
        if (!this.fighter.isOnGround) {
            //Increases downward velocity, but don't exceed max fall speed
            this.fighter.velocity.y = Math.min(
                this.fighter.velocity.y + FighterConfig.gravity * dt,
                FighterConfig.maxFallSpeed
            );
        }
    }

    /**
     * Updates the fighter's position based on their current velocity with collision detection.
     *
     * @param {number} dt - Delta time (time since last update).
     */
    updatePosition(dt) {
        //Calculates position change
        const dx = this.fighter.velocity.x * dt;
        const dy = this.fighter.velocity.y * dt;

        //Updates horizontal position and check for collisions
        this.fighter.position.x += dx;
        this.collisionDetector.checkHorizontalCollisions(this.fighter);

        //Updates vertical position and check for collisions
        this.fighter.position.y += dy;
        this.collisionDetector.checkVerticalCollisions(this.fighter);

        //Keeps fighter within horizontal map boundaries
        this.fighter.position.x = Math.max(
            0,
            Math.min(
                Math.round(this.fighter.position.x),
                this.fighter.map.width * Tile.SIZE - this.fighter.dimensions.x
            )
        );

        //Rounds vertical position to avoid sub-pixel rendering
        this.fighter.position.y = Math.round(this.fighter.position.y);
    }
}
