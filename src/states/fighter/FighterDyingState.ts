import FighterState from "./FighterState";
import Fighter from "../../entities/Fighter";

export default class FighterDyingState extends FighterState {
    hasCollapsed: boolean = false;

    /**
     * Creates a new FighterDyingState instance.
     *
     * @param {Fighter} fighter - The fighter object.
     */
    constructor(fighter: Fighter) {
        super(fighter);
    }

    /**
     * Called when entering the dying state.
     */
    enter(): void {
        this.fighter.currentAnimation = this.fighter.animations.death;
        this.fighter.currentAnimation.refresh();

        //Stops all movement
        this.fighter.velocity.x = 0;
        this.fighter.velocity.y = 0;

        //Prevent any further damage
        this.fighter.isInvincible = true;

        this.fighter.setDimensionsForAnimation("death", 0);
        this.hasCollapsed = false;
    }

    /**
     * Updates the dying state.
     *
     * @param {number} dt - The time passed since the last update.
     */
    update(dt: number): void {
        super.update(dt);

        if (!this.hasCollapsed && this.fighter.currentAnimation.isHalfwayDone()) {
            this.hasCollapsed = true;
            this.fighter.setDimensionsForAnimation("death", 1);
            this.fighter.position.y += 10;
        }

        //Checks if animation is done and sets the fighter to dead
        if (this.fighter.currentAnimation.isDone()) {
            this.fighter.isDead = true;
        }
    }
}
