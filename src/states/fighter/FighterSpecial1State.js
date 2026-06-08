import Fighter from "../../entities/Fighter.js";
import FighterStateName from "../../enums/FighterStateName.js";
import SoundName from "../../enums/SoundName.js";
import { sounds } from "../../globals.js";
import FighterState from "./FighterState.js";

export default class FighterSpecial1State extends FighterState {
    /**
     * Constructor for the FighterSpecial1State class.
     *
     * @param {Fighter} fighter - The fighter entity.
     */
    constructor(fighter) {
        super(fighter);
    }

    /**
     * Called when entering the special1 state.
     */
    enter() {
        sounds.play(SoundName.PowerUp);
        this.fighter.playerNumber === 1
            ? sounds.play(SoundName.Kamehameha)
            : sounds.play(SoundName.FinalFlash);

        this.fighter.currentMove = this.fighter.moves.beam;
        this.fighter.currentAnimation = this.fighter.animations.special1;
        this.fighter.currentAnimation.refresh();

        //Saves the original position
        this.originalX = this.fighter.position.x;
        this.originalY = this.fighter.position.y;

        //Calculates where the ground is
        this.groundY = this.fighter.position.y + this.fighter.dimensions.y;

        //Sets initial frame dimensions
        this.fighter.setDimensionsForAnimation("special1", 0);
    }

    /**
     * Called when exiting the special1 state.
     */
    exit() {
        this.clearAttackHitbox();

        //Reset the position
        this.fighter.position.x = this.originalX;
        this.fighter.position.y = this.originalY;
    }

    /**
     * Updates the special1 state.
     *
     * @param {number} dt - The time passed since the last update.
     */
    update(dt) {
        super.update(dt);

        const currentFrame = this.fighter.currentAnimation.currentFrame;

        //Updates dimensions to current frame
        this.fighter.setDimensionsForAnimation("special1", currentFrame);

        //Keeps the bottom anchored to the ground
        this.fighter.position.y = this.groundY - this.fighter.dimensions.y;

        //Sets attack hitbox during beam frame
        if (currentFrame === 6) {
            this.setBeamHitbox();
        }

        if (this.fighter.currentAnimation.isDone()) {
            if (this.fighter.isOnGround) {
                this.fighter.stateMachine.change(FighterStateName.Idling);
            } else {
                this.fighter.stateMachine.change(FighterStateName.Falling);
            }
        }
    }

    /**
     * Sets the attack hitbox for the beam frame of the special1 animation.
     */
    setBeamHitbox() {
        this.fighter.currentMove.hitbox.set(
            this.fighter.position.x,
            this.fighter.position.y,
            this.fighter.dimensions.x,
            this.fighter.dimensions.y
        );
    }

    /**
     * Clears the attack hitbox by setting its position and dimensions to zero.
     */
    clearAttackHitbox() {
        this.fighter.currentMove.hitbox.set(0, 0, 0, 0);
    }
}
