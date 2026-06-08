import Fighter from "../../entities/Fighter";
import FighterStateName from "../../enums/FighterStateName";
import { input } from "../../globals";
import FighterState from "./FighterState";

export default class FighterIdlingState extends FighterState {
    /**
     * Creates a new FighterIdlingState instance.
     *
     * @param {Fighter} fighter - The fighter object.
     */
    constructor(fighter: Fighter) {
        super(fighter);
    }

    /**
     * Called when entering the idling state.
     */
    enter(): void {
        this.fighter.velocity.x = 0;
        this.fighter.velocity.y = 0;
        this.fighter.currentAnimation = this.fighter.animations.idle;

        //Sets the idling animation dimensions
        this.fighter.setDimensionsForAnimation("idle", 0);
    }

    /**
     * Updates the idling state.
     *
     * @param {number} dt - The time passed since the last update.
     */
    update(dt: number): void {
        super.update(dt);
        this.handleInput();
    }

    /**
     * Handles fighter input.
     */
    handleInput(): void {
        if (input.isKeyPressed(this.controls.jump)) {
            this.fighter.stateMachine.change(FighterStateName.Jumping);
        }
        if (
            input.isKeyHeld(this.controls.moveLeft) !==
            input.isKeyHeld(this.controls.moveRight)
        ) {
            this.fighter.stateMachine.change(FighterStateName.Walking);
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
}
