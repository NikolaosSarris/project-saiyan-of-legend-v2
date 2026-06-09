import Fighter from "../../entities/Fighter";
import FighterStateName from "../../enums/FighterStateName";
import SoundName from "../../enums/SoundName";
import { sounds } from "../../globals";
import FighterState from "./FighterState";

export default class FighterTakingDamageState extends FighterState {
    /**
     * Constructor for the FighterTakingDamageState class.
     *
     * @param {Fighter} fighter - The fighter instance.
     */
    constructor(fighter: Fighter) {
        super(fighter);
    }

    /**
     * Called when entering the taking damage state.
     */
    enter(): void {
        sounds.play(SoundName.Hit);

        this.fighter.currentAnimation = this.fighter.animations.damage;
        this.fighter.currentAnimation.refresh();

        this.fighter.isInvincible = true;

        //Sets dimensions for damage animation
        this.fighter.setDimensionsForAnimation("damage", 0);
        this.fighter.position.y += 5;
    }

    /**
     * Called when exiting the taking damage state.
     */
    exit(): void {
        //Makes the fighter not invincible
        this.fighter.isInvincible = false;
    }

    /**
     * Updates the taking damage state.
     *
     * @param {number} dt - The time passed since the last update.
     */
    update(dt: number): void {
        super.update(dt);
        this.fighter.velocity.x *= 0.8;
        if (Math.abs(this.fighter.velocity.x) < 5) this.fighter.velocity.x = 0;

        if (this.fighter.currentAnimation.isDone()) {
            if (this.fighter.isOnGround) {
                this.fighter.stateMachine.change(FighterStateName.Idling);
            } else {
                this.fighter.stateMachine.change(FighterStateName.Falling);
            }
        }
    }
}
