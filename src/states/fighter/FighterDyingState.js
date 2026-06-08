import FighterState from "./FighterState.js";

export default class FighterDyingState extends FighterState {
    /**
     * Creates a new FighterAttackingState instance.
     *
     * @param {Fighter} fighter - The fighter object.
     */
    constructor(fighter) {
        super(fighter);
    }

    /**
     * Called when entering the dying state.
     */
    enter() {
        this.fighter.currentAnimation = this.fighter.animations.death;
        this.fighter.currentAnimation.refresh();

        //Stops all movement
        this.fighter.velocity.x = 0;
        this.fighter.velocity.y = 0;

        //Prevent any further damage
        this.fighter.isInvincible = true;

        this.fighter.setDimensionsForAnimation("death", 0);
    }

    /**
     * Updates the dying state.
     *
     * @param {number} dt - The time passed since the last update.
     */
    update(dt) {
        super.update(dt);

        if (this.fighter.currentAnimation.isHalfwayDone()) {
            this.fighter.setDimensionsForAnimation("death", 1);
            this.fighter.position.y += 10;
        }

        //Checks if animation is done and sets the fighter to dead
        if (this.fighter.currentAnimation.isDone()) {
            this.fighter.isDead = true;
        }
    }
}
