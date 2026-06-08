import { input } from "../../globals.js";
import Input from "../../../lib/Input.js";
import FighterState from "./FighterState.js";
import Fighter from "../../entities/Fighter.js";
import FighterStateName from "../../enums/FighterStateName.js";

export default class FighterWalkingState extends FighterState {
    /**
     * Creates a new FighterWalkingState instance.
     *
     * @param {Fighter} fighter - The player object.
     */
    constructor(fighter) {
        super(fighter);
        this.isMovingRight = false;
        this.isMovingLeft = false;
    }

    /**
     * Called when entering the walking state.
     */
    enter() {
        this.fighter.isOnGround = true;
        this.fighter.currentAnimation = this.fighter.animations.walk;
        this.fighter.currentAnimation.refresh();

        //Sets the walking animation dimensions
        this.fighter.setDimensionsForAnimation("walk", 0);
        this.fighter.position.y += 15;
    }

    /**
     * Updates the walking state.
     *
     * @param {number} dt - The time passed since the last update.
     */
    update(dt) {
        super.update(dt);
        this.checkTransitions();
        this.handleInput();
        this.handleHorizontalMovement();
    }

    /**
     * Handles player input.
     */
    handleInput() {
        if (input.isKeyHeld(this.controls.moveLeft) && !this.isMovingRight) {
            this.isMovingLeft = true;
        } else {
            this.isMovingLeft = false;
        }
        if (input.isKeyHeld(this.controls.moveRight) && !this.isMovingLeft) {
            this.isMovingRight = true;
        } else {
            this.isMovingRight = false;
        }
        if (input.isKeyPressed(this.controls.jump)) {
            this.fighter.stateMachine.change(FighterStateName.Jumping);
        }
        if (input.isKeyPressed(this.controls.attack)) {
            this.fighter.stateMachine.change(FighterStateName.Attacking);
        }
        if (input.isKeyHeld(this.controls.block)) {
            this.fighter.stateMachine.change(FighterStateName.Blocking);
        }
    }

    /**
     * Checks for state transitions.
     */
    checkTransitions() {
        if (this.shouldIdle()) {
            this.fighter.stateMachine.change(FighterStateName.Idling);
        }

        if (!this.fighter.isOnGround) {
            if (this.fighter.velocity.y < 0) {
                this.fighter.stateMachine.change(FighterStateName.Jumping);
            } else {
                this.fighter.stateMachine.change(FighterStateName.Falling);
            }
        }
    }

    /**
     * Determines if the player should transition to the idling state.
     *
     * @returns {boolean} True if the player should idle, false otherwise.
     */
    shouldIdle() {
        return (
            !this.isMovingLeft &&
            !this.isMovingRight &&
            Math.abs(this.fighter.velocity.x) < 0.1
        );
    }
}
