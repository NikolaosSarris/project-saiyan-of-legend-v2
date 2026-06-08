import Fighter from "../../entities/Fighter.js";
import FighterStateName from "../../enums/FighterStateName.js";
import SoundName from "../../enums/SoundName.js";
import { sounds } from "../../globals.js";
import FighterState from "./FighterState.js";

export default class FighterAttackingState extends FighterState {
    /**
     * Creates a new FighterAttackingState instance.
     *
     * @param {Fighter} fighter - The fighter object.
     */
    constructor(fighter) {
        super(fighter);
    }

    /**
     * Called when entering the attacking state.
     */
    enter() {
        sounds.play(SoundName.Punch);

        this.fighter.currentMove = this.fighter.moves.punch;

        this.fighter.currentAnimation = this.fighter.animations.attack;
        this.fighter.currentAnimation.refresh();

        //Sets the attack animation dimensions
        this.fighter.setDimensionsForAnimation("attack", 0);
        this.fighter.position.y += 5;
    }

    /**
     * Clears the attack hitbox by setting its position and dimensions to zero.
     */
    exit() {
        this.clearAttackHitbox();
    }

    /**
     * Updates the attacking state.
     *
     * @param {number} dt - The time passed since the last update.
     */
    update(dt) {
        super.update(dt);

        this.setAttackHitbox();

        if (this.fighter.currentAnimation.isDone()) {
            if (this.fighter.isOnGround) {
                this.fighter.stateMachine.change(FighterStateName.Idling);
            } else {
                this.fighter.stateMachine.change(FighterStateName.Falling);
            }
        }
    }

    /**
     * Sets the attack hitbox for the current move.
     *
     */
    setAttackHitbox() {
        const offset = this.fighter.currentMove.getHitboxOffset(
            this.fighter.isFacingRight
        );
        this.fighter.currentMove.hitbox.set(
            this.fighter.position.x + offset.position.x,
            this.fighter.position.y + offset.position.y,
            offset.dimensions.x,
            offset.dimensions.y
        );
    }

    /**
     * Clears the attack hitbox by setting its position and dimensions to zero.
     */
    clearAttackHitbox() {
        this.fighter.currentMove.hitbox.set(0, 0, 0, 0);
    }
}
