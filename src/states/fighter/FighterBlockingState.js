import Fighter from "../../entities/Fighter.js";
import FighterStateName from "../../enums/FighterStateName.js";
import { input } from "../../globals.js";
import FighterState from "./FighterState.js";

export default class FighterBlockingState extends FighterState {
    /**
     * Creates a new FighterBlockingState instance.
     *
     * @param {Fighter} fighter - The fighter object.
     */
    constructor(fighter) {
        super(fighter);
    }

    /**
     * Called when entering the blocking state.
     */
    enter() {
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
    update(dt) {
        super.update(dt);

        if (!input.isKeyHeld(this.controls.block)) {
            this.fighter.isBlocking = false;
            this.fighter.stateMachine.change(FighterStateName.Idling);
        }
    }
}
