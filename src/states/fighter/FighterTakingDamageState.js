import Fighter from "../../entities/Fighter.js";
import FighterStateName from "../../enums/FighterStateName.js";
import SoundName from "../../enums/SoundName.js";
import { sounds } from "../../globals.js";
import FighterState from "./FighterState.js";

export default class FighterTakingDamageState extends FighterState {
    /**
     * Constructor for the FighterTakingDamageState class.
     *
     * @param {Fighter} fighter - The fighter instance.
     */
    constructor(fighter) {
        super(fighter);
    }

    /**
     * Called when entering the taking damage state.
     */
    enter() {
        sounds.play(SoundName.Hit);

        this.fighter.currentAnimation = this.fighter.animations.damage;
        this.fighter.currentAnimation.refresh();

        //Stops movement and makes fighter invincible
        this.fighter.velocity.x = 0;
        this.fighter.isInvincible = true;

        //Sets dimensions for damage animation
        this.fighter.setDimensionsForAnimation("damage", 0);
        this.fighter.position.y += 5;
    }

    /**
     * Called when exiting the taking damage state.
     */
    exit() {
        //Makes the fighter not invincible
        this.fighter.isInvincible = false;
    }

    /**
     * Updates the taking damage state.
     *
     * @param {number} dt - The time passed since the last update.
     */
    update(dt) {
        super.update(dt);

        if (this.fighter.currentAnimation.isDone()) {
            if (this.fighter.isOnGround) {
                this.fighter.stateMachine.change(FighterStateName.Idling);
            } else {
                this.fighter.stateMachine.change(FighterStateName.Falling);
            }
        }
    }
}
