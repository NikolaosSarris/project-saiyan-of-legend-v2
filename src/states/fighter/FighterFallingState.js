import Fighter from "../../entities/Fighter.js";
import FighterStateName from "../../enums/FighterStateName.js";
import { input } from "../../globals.js";
import FighterState from "./FighterState.js";

export default class FighterFallingState extends FighterState {
    /**
     * Creates a new FighterFallingState instance.
     *
     * @param {Fighter} fighter - The fighter object.
     */
    constructor(fighter) {
        super(fighter);
    }

    /**
     * Called when entering the falling state.
     */
    enter() {
        this.fighter.currentAnimation = this.fighter.animations.fall;
        this.fighter.currentAnimation.refresh();

        //Sets the falling animation dimensions
        this.fighter.setDimensionsForAnimation("fall", 0);
    }

    /**
     * Updates the falling state.
     *
     * @param {number} dt - The time passed since the last update.
     */
    update(dt) {
        super.update(dt);

        this.handleHorizontalMovement();
        this.handleInput();
        this.checkTransitions();
    }

    /**
     * Checks for state transitions.
     */
    checkTransitions() {
        if (this.fighter.isOnGround) {
            if (Math.abs(this.fighter.velocity.x) < 0.1) {
                this.fighter.stateMachine.change(FighterStateName.Idling);
            } else {
                this.fighter.stateMachine.change(FighterStateName.Walking);
            }
        }
    }

    /**
     * Handles player input for the falling state.
     */
    handleInput() {
        if (input.isKeyPressed(this.controls.attack)) {
            this.fighter.stateMachine.change(FighterStateName.Attacking);
        }
        if (input.isKeyPressed(this.controls.special1)) {
            this.fighter.stateMachine.change(FighterStateName.Special1);
        }
        if (input.isKeyHeld(this.controls.block)) {
            this.fighter.stateMachine.change(FighterStateName.Blocking);
        }
    }
}
