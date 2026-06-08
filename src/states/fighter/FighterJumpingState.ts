import { FighterConfig } from "../../../config/FighterConfig";
import Fighter from "../../entities/Fighter";
import FighterStateName from "../../enums/FighterStateName";
import SoundName from "../../enums/SoundName";
import { input, sounds } from "../../globals";
import FighterState from "./FighterState";

export default class FighterJumpingState extends FighterState {
    /**
     * Creates a new FighterJumpingState instance.
     *
     * @param {Fighter} fighter - The fighter object.
     */
    constructor(fighter: Fighter) {
        super(fighter);
    }

    /**
     * Called when entering the jumping state.
     */
    enter(): void {
        sounds.play(SoundName.Jump);

        this.fighter.velocity.y = FighterConfig.jumpPower;
        this.fighter.currentAnimation = this.fighter.animations.jump;
        this.fighter.currentAnimation.refresh();
    }

    /**
     * Called when exiting the jumping state.
     */
    exit(): void {}

    /**
     * Updates the jumping state.
     * @param {number} dt - The time passed since the last update.
     */
    update(dt: number): void {
        super.update(dt);

        this.handleInput();
        this.handleHorizontalMovement();
        this.checkTransitions();
    }

    /**
     * Handles fighter input.
     */
    handleInput(): void {
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
    checkTransitions(): void {
        if (this.fighter.velocity.y >= 0) {
            this.fighter.stateMachine.change(FighterStateName.Falling);
        }
    }
}
