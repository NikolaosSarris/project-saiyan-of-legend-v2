import { loadFighterSprites, FighterSpriteConfig } from "../../config/SpriteConfig";
import Map from "../services/Map";
import StateMachine from "../../lib/StateMachine";
import Animation from "../../lib/Animation";
import { DEBUG, images } from "../globals";
import FighterStateName from "../enums/FighterStateName";
import Colour from "../enums/Colour";
import Entity from "./Entity";
import Vector from "../../lib/Vector";
import Hitbox from "../../lib/Hitbox";
import FighterIdlingState from "../states/fighter/FighterIdlingState";
import FighterWalkingState from "../states/fighter/FighterWalkingState";
import FighterJumpingState from "../states/fighter/FighterJumpingState";
import FighterFallingState from "../states/fighter/FighterFallingState";
import FighterAttackingState from "../states/fighter/FighterAttackingState";
import FighterDyingState from "../states/fighter/FighterDyingState";
import Tile from "../services/Tile";
import FighterBlockingState from "../states/fighter/FighterBlockingState";
import FighterSpecial1State from "../states/fighter/FighterSpecial1State";
import MoveFactory from "../services/MoveFactory";
import FighterTakingDamageState from "../states/fighter/FighterTakingDamageState";
import Move from "../services/Move";
import Sprite from "../../lib/Sprite";

export interface FighterSprites {
    idle: Sprite[];
    walk: Sprite[];
    jump: Sprite[];
    fall: Sprite[];
    death: Sprite[];
    block: Sprite[];
    damage: Sprite[];
    attack: Sprite[];
    special1: Sprite[];
}

export interface FighterAnimations {
    idle: Animation<Sprite>;
    walk: Animation<Sprite>;
    jump: Animation<Sprite>;
    fall: Animation<Sprite>;
    death: Animation<Sprite>;
    block: Animation<Sprite>;
    damage: Animation<Sprite>;
    attack: Animation<Sprite>;
    special1: Animation<Sprite>;
}

export interface FighterMoves {
    punch: Move;
    beam: Move;
}

export default class Fighter extends Entity {
    static MAX_HEALTH = 100;

    initialPosition: Vector;
    map: Map;
    spriteConfig: FighterSpriteConfig;
    name: string;
    health: number;
    playerNumber: 1 | 2;
    isInvincible: boolean;
    isDead: boolean;
    isBlocking: boolean;
    wins: number;
    isFacingRight: boolean;
    sprites!: FighterSprites;
    animations!: FighterAnimations;
    currentAnimation!: Animation<Sprite>;
    moves: FighterMoves;
    currentMove: Move | null;
    stateMachine: StateMachine;

    /**
     * Creates a new Fighter instance.
     *
     * @param {number} x - The initial x-coordinate.
     * @param {number} y - The initial y-coordinate.
     * @param {number} width - The width of the fighter.
     * @param {number} height - The height of the fighter.
     * @param {Map} map - The game map instance.
     * @param {Object} spriteConfig - The sprite configuration.
     * @param {string} name - The fighter's name.
     * @param {number} playerNumber - The player number.
     */
    constructor(x: number, y: number, width: number, height: number, map: Map, spriteConfig: FighterSpriteConfig, name: string, playerNumber: 1 | 2) {
        super(x, y, width, height);

        //Sets the fighter's properties
        this.initialPosition = new Vector(x, y);
        this.position = new Vector(x, y);
        this.dimensions = new Vector(width, height);
        this.velocity = new Vector(0, 0);
        this.map = map;
        this.spriteConfig = spriteConfig;
        this.name = name;
        this.health = Fighter.MAX_HEALTH;
        this.playerNumber = playerNumber;
        this.isInvincible = false;
        this.isDead = false;
        this.isBlocking = false;
        this.wins = 0;

        //Sets the fighter's facing direction
        this.isFacingRight = playerNumber === 1;

        this.sprites = loadFighterSprites(
            images.get(this.name),
            this.spriteConfig
        ) as unknown as FighterSprites;

        //Updates the fighter's animations
        this.updateAnimations();

        //Sets the fighter's current animation to idle
        this.currentAnimation = this.animations.idle;

        //Sets the fighter's moves
        this.moves = {
            punch: MoveFactory.createPunch(
                this.dimensions.x,
                this.dimensions.y
            ),
            beam: MoveFactory.createBeamAttack(
                this.dimensions.x,
                this.dimensions.y
            ),
        };
        this.currentMove = null;

        //Initialize state machine for fighter behavior
        this.stateMachine = new StateMachine();

        //Add states to the state machine
        this.stateMachine.add(
            FighterStateName.Falling,
            new FighterFallingState(this)
        );
        this.stateMachine.add(
            FighterStateName.Jumping,
            new FighterJumpingState(this)
        );
        this.stateMachine.add(
            FighterStateName.Walking,
            new FighterWalkingState(this)
        );
        this.stateMachine.add(
            FighterStateName.Dying,
            new FighterDyingState(this)
        );
        this.stateMachine.add(
            FighterStateName.Blocking,
            new FighterBlockingState(this)
        );
        this.stateMachine.add(
            FighterStateName.TakingDamage,
            new FighterTakingDamageState(this)
        );
        this.stateMachine.add(
            FighterStateName.Attacking,
            new FighterAttackingState(this)
        );
        this.stateMachine.add(
            FighterStateName.Special1,
            new FighterSpecial1State(this)
        );
        this.stateMachine.add(
            FighterStateName.Idling,
            new FighterIdlingState(this)
        );
    }

    /**
     * Updates the animations for different fighter states
     */
    updateAnimations(): void {
        //Creates animations for different fighter states
        this.animations = {
            idle: new Animation<Sprite>(this.sprites.idle),
            walk: new Animation<Sprite>(this.sprites.walk, 0.5, 1),
            jump: new Animation<Sprite>(this.sprites.jump, 0.15, 1),
            fall: new Animation<Sprite>(this.sprites.fall, 0.5, 1),
            death: new Animation<Sprite>(this.sprites.death, 0.25, 1),
            block: new Animation<Sprite>(this.sprites.block, 0.1, 1),
            damage: new Animation<Sprite>(this.sprites.damage, 0.2, 1),
            attack: new Animation<Sprite>(this.sprites.attack, 0.1, 1),
            special1: new Animation<Sprite>(this.sprites.special1, 0.5, 1),
        };
    }

    /**
     * Sets the dimensions of the fighter to match the dimensions of the current animation frame.
     *
     * @param {string} animationName - The name of the animation.
     * @param {number} [frame] - The frame number of the animation.
     */
    setDimensionsForAnimation(animationName: keyof FighterSpriteConfig, frame = 0): void {
        const frames = this.spriteConfig[animationName];
        this.dimensions.x = frames[frame].width!;
        this.dimensions.y = frames[frame].height!;
    }

    /**
     * Updates the position and dimensions of the fighter's hitbox.
     */
    updateHitbox(): void {
        this.hitbox.set(
            this.position.x,
            this.position.y,
            this.dimensions.x,
            this.dimensions.y
        );
    }

    /**
     * Checks if the fighter's attack hitbox collides with the target's hitbox.
     *
     * @param {Fighter} target - The target fighter to check collision with.
     * @returns {boolean | undefined} True if the attack hitbox collides with the target's hitbox, false otherwise.
     */
    attackHitboxCollidesWith(target: Fighter): boolean | undefined {
        return this.currentMove?.hitbox.didCollide(target.hitbox);
    }

    /**
     * Makes the fighter take damage.
     *
     * @param {number} damage - Amount of damage to take.
     */
    receiveDamage(damage: number): void {
        //If the fighter is not invincible or dead, take damage
        if (!this.isInvincible && !this.isDead) {
            //If the fighter is blocking, half the damage
            if (this.isBlocking) {
                damage /= 2;
            }

            //Update health
            this.health = Math.max(0, this.health - damage);

            //If the fighter is not blocking and is not dead, change state to taking damage
            if (!this.isBlocking && this.health > 0) {
                this.stateMachine.change(FighterStateName.TakingDamage);
            }

            //If health is 0 then die
            if (this.health === 0) {
                this.die();
            }
        }
    }

    /**
     * Sets the fighter's state to dying.
     */
    die(): void {
        this.stateMachine.change(FighterStateName.Dying);
    }

    /**
     * Checks if the fighter has fallen off the map.
     */
    checkFallOffMap(): void {
        //Gets the bottom of the map
        const mapBottom = this.map.height * Tile.SIZE;

        //Checks if fighter has fallen below the map then dies
        if (this.position.y > mapBottom) {
            this.health = 0;
            this.die();
        }
    }

    /**
     * Updates the fighter's state.
     *
     * @param {number} dt - The time passed since the last update.
     */
    update(dt: number): void {
        this.stateMachine.update(dt);
        this.updateHitbox();
        this.checkFallOffMap();
    }

    /**
     * Renders the fighter.
     *
     * @param {CanvasRenderingContext2D} context - The rendering context.
     */
    render(context: CanvasRenderingContext2D): void {
        this.stateMachine.render(context);

        if (DEBUG) {
            this.hitbox.render(context);
            this.currentMove?.hitbox.render(context);
        }
    }
}
