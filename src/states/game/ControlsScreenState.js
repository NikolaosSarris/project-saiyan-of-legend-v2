import Input from "../../../lib/Input.js";
import State from "../../../lib/State.js";
import ImageName from "../../enums/ImageName.js";
import GameStateName from "../../enums/GameStateName.js";
import Colour from "../../enums/Colour.js";
import {
    CANVAS_HEIGHT,
    CANVAS_WIDTH,
    images,
    input,
    sounds,
    stateMachine,
} from "../../globals.js";
import Game from "../../../lib/Game.js";
import GameManager from "../../services/GameManager.js";
import SoundName from "../../enums/SoundName.js";

export default class ControlsScreenState extends State {
    /**
     * The constructor for the ControlsScreenState class.
     */
    constructor() {
        super();

        // Layout constants
        this.leftColumnX = CANVAS_WIDTH / 4;
        this.rightColumnX = (CANVAS_WIDTH * 3) / 4;
        this.startY = 70;
        this.lineHeight = 25;
    }

    /**
     * Called when the controls screen state is entered.
     */
    enter() {
        //Plays the main theme
        sounds.play(SoundName.MainTheme);

        //Saves the controls screen state
        GameManager.saveControlsScreen();
    }

    /**
     * Called when the controls screen state is exited.
     */
    exit() {
        sounds.stop(SoundName.MainTheme);
    }

    /**
     * Checks if the ENTER key is pressed and then transitions to the play state.
     */
    update() {
        if (input.isKeyPressed(Input.KEYS.ENTER)) {
            stateMachine.change(GameStateName.Play);
        }
    }

    /**
     * Renders the controls screen state.
     *
     * @param {CanvasRenderingContext2D} context - The canvas rendering context.
     */
    render(context) {
        context.save();
        this.renderBackground(context);
        this.renderHeader(context);
        this.renderPlayerControls(context);
        this.renderFooter(context);
        context.restore();
    }

    /**
     * Renders the controls screen state.
     *
     * @param {CanvasRenderingContext2D} context - The canvas rendering context.
     */
    renderBackground(context) {
        images.render(ImageName.TitleScreen, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        //Dims the background
        context.fillStyle = "rgba(0, 0, 0, 0.7)";
        context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }

    /**
     * Renders the header.
     */
    renderHeader(context) {
        context.textBaseline = "top";
        context.font = "20px PressStart2P";
        context.fillStyle = Colour.White;
        context.textAlign = "center";
        context.fillText("CONTROLS", CANVAS_WIDTH / 2, 20);
    }

    /**
     * Renders both sets of player control.
     */
    renderPlayerControls(context) {
        //Player controls
        const player1Controls = [
            "W - Jump",
            "A/D - Move",
            "S - Block",
            "E - Attack",
            "1/2/3 - Specials",
        ];
        const player2Controls = [
            "I - Jump",
            "J/L - Move",
            "K - Block",
            "O - Attack",
            "7/8/9 - Specials",
        ];

        context.textAlign = "center";

        //Player 1 Section
        context.font = "16px PressStart2P";
        context.fillStyle = Colour.Gold;
        context.fillText("PLAYER 1", this.leftColumnX, this.startY);

        //Player 1 controls
        context.font = "12px PressStart2P";
        context.fillStyle = Colour.White;

        let currentY = this.startY + 40;
        player1Controls.forEach((control) => {
            context.fillText(control, this.leftColumnX, currentY);
            currentY += this.lineHeight;
        });

        //Player 2 Section
        context.font = "16px PressStart2P";
        context.fillStyle = Colour.Gold;
        context.fillText("PLAYER 2", this.rightColumnX, this.startY);

        //Player 2 controls
        context.font = "12px PressStart2P";
        context.fillStyle = Colour.White;

        currentY = this.startY + 40;
        player2Controls.forEach((control) => {
            context.fillText(control, this.rightColumnX, currentY);
            currentY += this.lineHeight;
        });
    }

    /**
     * Renders the footer.
     */
    renderFooter(context) {
        context.font = "16px PressStart2P";
        context.fillStyle = Colour.White;
        context.textAlign = "center";
        context.fillText(
            "Press Enter To Fight",
            CANVAS_WIDTH / 2,
            CANVAS_HEIGHT - 40
        );
    }
}
