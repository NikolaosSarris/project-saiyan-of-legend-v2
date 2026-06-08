import { FighterConfig } from "../../../config/FighterConfig.js";
import Fighter from "../../entities/Fighter.js";
import FighterStateName from "../../enums/FighterStateName.js";
import SoundName from "../../enums/SoundName.js";
import { input, sounds } from "../../globals.js";
import FighterState from "./FighterState.js";

export default class FighterJumpingState extends FighterState {
    /**
     * Creates a new FighterJumpingState instance.
     *
     * @param {Fighter} fighter - The fighter object.
     */
    constructor(fighter) {
        super(fighter);
    }

    /**
     * Called when entering the jumping state.
     */
    enter() {
        sounds.play(SoundName.Jump);

        this.fighter.velocity.y = FighterConfig.jumpPower;
        this.fighter.currentAnimation = this.fighter.animations.jump;
        this.fighter.currentAnimation.refresh();
    }

    /**
     * Called when exiting the jumping state.
     */
    exit() {}

    /**
     * Updates the jumping state.
     * @param {number} dt - The time passed since the last update.
     */
    update(dt) {
        super.update(dt);

        this.handleInput();
        this.handleHorizontalMovement();
        this.checkTransitions();
    }

    /**
     * Handles fighter input.
     */
    handleInput() {
        if (
            !input.isKeyHeld(this.controls.jump) &&
            this.fighter.velocity.y < 0
        ) {
            this.fighter.velocity.y *= 0.5;
        }
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

    /**
     * Checks for state transitions.
     */
    checkTransitions() {
        if (this.fighter.velocity.y >= 0) {
            this.fighter.stateMachine.change(FighterStateName.Falling);
        }
    }
}
