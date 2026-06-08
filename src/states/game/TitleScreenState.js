import Input from "../../../lib/Input.js";
import State from "../../../lib/State.js";
import ImageName from "../../enums/ImageName.js";
import GameStateName from "../../enums/GameStateName.js";
import {
    CANVAS_HEIGHT,
    CANVAS_WIDTH,
    images,
    input,
    sounds,
    stateMachine,
} from "../../globals.js";
import Colour from "../../enums/Colour.js";
import GameManager from "../../services/GameManager.js";
import SoundName from "../../enums/SoundName.js";

export default class TitleScreenState extends State {
    /**
     * The constructor for the TitleScreenState class.
     */
    constructor() {
        super();
    }

    /**
     * Called when the title screen state is entered.
     */
    enter() {
        //Saves the title screen state
        GameManager.saveTitleScreen();

        //Plays the main theme
        sounds.play(SoundName.MainTheme);
    }

    /**
     * Called when the title screen state is exited.
     */
    exit() {
        sounds.pause(SoundName.MainTheme);
    }

    /**
     * Checks if the ENTER key is pressed and then transitions to the controls screen state.
     */
    update() {
        if (input.isKeyPressed(Input.KEYS.ENTER)) {
            stateMachine.change(GameStateName.ControlsScreen);
        }
    }

    /**
     * Renders the title screen state.
     *
     * @param {CanvasRenderingContext2D} context - The canvas rendering context.
     */
    render(context) {
        //Renders the title screen
        images.render(ImageName.TitleScreen, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        context.save();
        context.font = "30px PressStart2P";
        context.fillStyle = Colour.White;
        context.textBaseline = "middle";
        context.textAlign = "center";

        context.fillText(
            "Dragon Ball",
            CANVAS_WIDTH / 2,
            CANVAS_HEIGHT / 2 - 110
        );
        context.fillText(
            "Fighting Game",
            CANVAS_WIDTH / 2,
            CANVAS_HEIGHT / 2 - 70
        );
        context.font = "18px PressStart2P";
        context.fillText(
            "Press Enter To Begin",
            CANVAS_WIDTH / 2,
            CANVAS_HEIGHT - 80
        );

        context.restore();
    }
}
