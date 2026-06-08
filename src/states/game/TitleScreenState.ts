import Input from "../../../lib/Input";
import State from "../../../lib/State";
import ImageName from "../../enums/ImageName";
import GameStateName from "../../enums/GameStateName";
import {
    CANVAS_HEIGHT,
    CANVAS_WIDTH,
    images,
    input,
    sounds,
    stateMachine,
} from "../../globals";
import Colour from "../../enums/Colour";
import GameManager from "../../services/GameManager";
import SoundName from "../../enums/SoundName";

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
    enter(): void {
        //Saves the title screen state
        GameManager.saveTitleScreen();

        //Plays the main theme
        sounds.play(SoundName.MainTheme);
    }

    /**
     * Called when the title screen state is exited.
     */
    exit(): void {
        sounds.pause(SoundName.MainTheme);
    }

    /**
     * Checks if the ENTER key is pressed and then transitions to the controls screen state.
     */
    update(): void {
        if (input.isKeyPressed(Input.KEYS.ENTER)) {
            stateMachine.change(GameStateName.ControlsScreen);
        }
    }

    /**
     * Renders the title screen state.
     *
     * @param {CanvasRenderingContext2D} context - The canvas rendering context.
     */
    render(context: CanvasRenderingContext2D): void {
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
