import {
    gokuSpriteConfig,
    vegetaSpriteConfig,
} from "../../../config/SpriteConfig";
import State from "../../../lib/State";
import Fighter from "../../entities/Fighter";
import FighterStateName from "../../enums/FighterStateName";
import GameStateName from "../../enums/GameStateName";
import ImageName from "../../enums/ImageName";
import SoundName from "../../enums/SoundName";
import {
    CANVAS_HEIGHT,
    CANVAS_WIDTH,
    images,
    sounds,
    stateMachine,
    timer,
} from "../../globals";
import GameManager from "../../services/GameManager";
import { MapDefinition } from "../../services/Map";
import Map from "../../services/Map";
import HealthBar from "../../user-interface/HealthBar";

interface SavedPlayerData {
    position: { x: number; y: number };
    health: number;
    velocity: { x: number; y: number };
    isFacingRight: boolean;
    currentStateName: string;
}

interface PlayStateSaveData {
    player1: SavedPlayerData;
    player2: SavedPlayerData;
}

/**
 * Represents the main play state of the game.
 *
 * @extends State
 */
export default class PlayState extends State {
    map: Map;
    player1!: Fighter;
    player2!: Fighter;
    player1HealthBar!: HealthBar;
    player2HealthBar!: HealthBar;
    isProcessingHit: boolean = false;
    isGameOver: boolean = false;

    /**
     * Creates a new PlayState instance.
     *
     * @param {MapDefinition} mapDefinition - The definition object for the game map.
     */
    constructor(mapDefinition: MapDefinition) {
        super();

        //The game map
        this.map = new Map(mapDefinition);
    }

    /**
     * Initializes the play state.
     */
    enter(savedStateData?: unknown): void {
        sounds.play(SoundName.BattleTheme);

        //Checks if we're restoring from a save
        if (savedStateData) {
            this.loadFromSave(savedStateData as PlayStateSaveData);
        } else {
            this.startNewGame();
        }

        //Restores wins
        const savedWins = GameManager.loadWins();
        this.player1.wins = savedWins.player1Wins;
        this.player2.wins = savedWins.player2Wins;

        this.isProcessingHit = false;
        this.isGameOver = false;
    }

    exit(): void {
        sounds.pause(SoundName.BattleTheme);
    }

    /**
     * Starts a new game with default positions and full health
     */
    startNewGame(): void {
        //Creates fighters
        this.player1 = new Fighter(
            50,
            174,
            31,
            52,
            this.map,
            gokuSpriteConfig,
            ImageName.Goku,
            1
        );
        this.player2 = new Fighter(
            470,
            174,
            23,
            50,
            this.map,
            vegetaSpriteConfig,
            ImageName.Vegeta,
            2
        );

        //Creates health bars
        this.player1HealthBar = new HealthBar(
            50,
            20,
            150,
            10,
            Fighter.MAX_HEALTH,
            HealthBar.PLAYER1_LABEL
        );
        this.player2HealthBar = new HealthBar(
            360,
            20,
            150,
            10,
            Fighter.MAX_HEALTH,
            HealthBar.PLAYER2_LABEL
        );
    }

    /**
     * Loads the game state from saved data
     */
    loadFromSave(savedStateData: PlayStateSaveData): void {
        //Restores fighters
        this.player1 = new Fighter(
            savedStateData.player1.position.x,
            savedStateData.player1.position.y,
            31,
            52,
            this.map,
            gokuSpriteConfig,
            ImageName.Goku,
            1
        );
        this.player2 = new Fighter(
            savedStateData.player2.position.x,
            savedStateData.player2.position.y,
            23,
            50,
            this.map,
            vegetaSpriteConfig,
            ImageName.Vegeta,
            2
        );

        //Restores fighter properties
        this.player1.health = savedStateData.player1.health;
        this.player1.velocity.x = savedStateData.player1.velocity.x;
        this.player1.velocity.y = savedStateData.player1.velocity.y;
        this.player1.isFacingRight = savedStateData.player1.isFacingRight;
        this.player1.stateMachine.change(
            savedStateData.player1.currentStateName
        );

        this.player2.health = savedStateData.player2.health;
        this.player2.velocity.x = savedStateData.player2.velocity.x;
        this.player2.velocity.y = savedStateData.player2.velocity.y;
        this.player2.isFacingRight = savedStateData.player2.isFacingRight;
        this.player2.stateMachine.change(
            savedStateData.player2.currentStateName
        );

        //Creates health bars
        this.player1HealthBar = new HealthBar(
            50,
            20,
            150,
            10,
            Fighter.MAX_HEALTH,
            HealthBar.PLAYER1_LABEL
        );

        this.player2HealthBar = new HealthBar(
            360,
            20,
            150,
            10,
            Fighter.MAX_HEALTH,
            HealthBar.PLAYER2_LABEL
        );
    }

    /**
     * Updates the play state.
     *
     * @param {number} dt - The time passed since the last update.
     */
    update(dt: number): void {
        timer.update(dt);
        this.map.update(dt);

        this.player1.update(dt);
        this.player2.update(dt);

        //Checks if a hit is not being processed then checks for collisions
        if (!this.isProcessingHit) {
            this.checkAttackCollisions();
        }

        this.player1HealthBar.update(this.player1.health);
        this.player2HealthBar.update(this.player2.health);

        //Checks if either player is dead
        this.checkVictory();

        //Saves the play state
        if (!this.isGameOver) {
            GameManager.savePlayState(this.player1, this.player2);
        }
    }

    /**
     * Renders the play state.
     *
     * @param {CanvasRenderingContext2D} context - The rendering context.
     */
    render(context: CanvasRenderingContext2D): void {
        images.render(ImageName.Background, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        this.map.render(context);

        this.player1.render(context);
        this.player2.render(context);

        this.player1HealthBar.render(context);
        this.player2HealthBar.render(context);
    }

    /**
     * Checks if either player's attack hitbox collides with the other player's body.
     */
    checkAttackCollisions(): void {
        //Checks if player2's attack hit player1's body
        if (this.player1.attackHitboxCollidesWith(this.player2)) {
            this.handleAttackHit(this.player1, this.player2);
        }
        //Checks if player2's attack hit player1's body
        if (this.player2.attackHitboxCollidesWith(this.player1)) {
            this.handleAttackHit(this.player2, this.player1);
        }
    }

    /**
     * Handles when an attack successfully lands.
     */
    handleAttackHit(attacker: Fighter, victim: Fighter): void {
        this.isProcessingHit = true;

        //Deals damage to the victim
        victim.receiveDamage(attacker.currentMove!.damage);

        //Checks if the victim is blocking and plays the hit sound
        if (
            victim.stateMachine.currentState.name === FighterStateName.Blocking
        ) {
            sounds.play(SoundName.Hit);
        }

        //Waits a bit before allowing another hit
        timer.addTask(
            () => {},
            0,
            0.5,
            () => {
                this.isProcessingHit = false;
            }
        );
    }

    /**
     * Checks if either player is dead and if so, changes the game state to the victory state.
     */
    checkVictory(): void {
        //Checks if either player is dead
        if ((this.player1.isDead || this.player2.isDead) && !this.isGameOver) {
            this.isGameOver = true;

            //Determines the winner
            const winner = this.player1.isDead ? this.player2 : this.player1;
            winner.wins++;

            //Plays a victory sound
            this.player1.isDead
                ? sounds.play(SoundName.VegetaWin)
                : sounds.play(SoundName.GokuWin);

            //Waits 3 seconds before transitioning to the victory state
            timer.addTask(
                () => {},
                0,
                3,
                () => {
                    stateMachine.change(GameStateName.VictoryScreen, {
                        winnerName: winner.name,
                        player1Wins: this.player1.wins,
                        player2Wins: this.player2.wins,
                    });
                }
            );
        }
    }
}
