import Fighter from "../../entities/Fighter";
import FighterStateName from "../../enums/FighterStateName";
import { input } from "../../globals";
import FighterState from "./FighterState";

export default class FighterBlockingState extends FighterState {
    /**
     * Creates a new FighterBlockingState instance.
     *
     * @param {Fighter} fighter - The fighter object.
     */
    constructor(fighter: Fighter) {
        super(fighter);
    }

    /**
     * Called when entering the blocking state.
     */
    enter(): void {
        this.fighter.currentAnimation = this.fighter.animations.block;
        this.fighter.currentAnimation.refresh();

        //Sets the blocking animation dimensions
        this.fighter.setDimensionsForAnimation("block", 0);
        this.fighter.position.y += 5;

        this.fighter.isBlocking = true;
    }

    /**
     * Updates the blocking state.
     *
     * @param {number} dt - The time passed since the last update.
     */
    update(dt: number): void {
        super.update(dt);

        if (!input.isKeyHeld(this.controls.block)) {
            this.fighter.isBlocking = false;
            this.fighter.stateMachine.change(FighterStateName.Idling);
        }
    }
}
