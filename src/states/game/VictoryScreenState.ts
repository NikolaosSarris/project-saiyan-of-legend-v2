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
import Input from "../../../lib/Input";
import Colour from "../../enums/Colour";
import GameManager from "../../services/GameManager";
import SoundName from "../../enums/SoundName";

export default class VictoryScreenState extends State {
    winnerName!: string;
    player1Wins!: number;
    player2Wins!: number;

    constructor() {
        super();
    }

    enter(params: unknown): void {
        //Plays the main theme
        sounds.play(SoundName.MainTheme);

        //Sets the params
        const { winnerName, player1Wins, player2Wins } = params as {
            winnerName: string;
            player1Wins: number;
            player2Wins: number;
        };
        this.winnerName = winnerName;
        this.player1Wins = player1Wins;
        this.player2Wins = player2Wins;

        //Saves the victory state
        GameManager.saveVictoryScreen(
            this.winnerName,
            this.player1Wins,
            this.player2Wins
        );
    }

    exit(): void {
        sounds.stop(SoundName.BattleTheme);
    }

    update(): void {
        if (input.isKeyPressed(Input.KEYS.ENTER)) {
            stateMachine.change(GameStateName.TitleScreen);
        }

        if (input.isKeyPressed(Input.KEYS.F)) {
            stateMachine.change(GameStateName.Play);
        }
    }

    render(context: CanvasRenderingContext2D): void {
        //Renders the play state background
        images.render(ImageName.Background, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        //Dims the background
        context.fillStyle = "rgba(0, 0, 0, 0.6)";
        context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        context.save();
        context.textBaseline = "middle";
        context.textAlign = "center";

        const leftX = CANVAS_WIDTH / 6;
        const rightX = (CANVAS_WIDTH * 5) / 6;
        const centerY = CANVAS_HEIGHT / 2;

        //Displays the winners name and that they won
        context.font = "24px PressStart2P";
        context.fillStyle = Colour.Gold;
        context.fillText(
            this.winnerName.toUpperCase(),
            CANVAS_WIDTH / 2,
            centerY - 40
        );
        context.font = "24px PressStart2P";
        context.fillStyle = Colour.Gold;
        context.fillText("WINS", CANVAS_WIDTH / 2, centerY + 10);

        context.fillStyle = Colour.White;

        //Displays the number of wins for player 1
        context.fillText("P1", leftX, centerY - 40);
        context.fillText(String(this.player1Wins), leftX, centerY + 10);

        //Displays the number of wins for player 2
        context.fillText("P2", rightX, centerY - 40);
        context.fillText(String(this.player2Wins), rightX, centerY + 10);

        //Displays the controls to continue
        context.font = "14px PressStart2P";
        context.fillText(
            "Press F For Rematch",
            CANVAS_WIDTH / 2,
            CANVAS_HEIGHT - 80
        );
        context.fillText(
            "Press Enter For Title Screen",
            CANVAS_WIDTH / 2,
            CANVAS_HEIGHT - 50
        );

        context.restore();
    }
}
