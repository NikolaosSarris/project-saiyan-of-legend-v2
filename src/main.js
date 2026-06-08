/**
 * Dragon Ball Fighting Game
 *
 * Nikolaos Sarris
 *
 * A 2-player fighting game inspired by Dragon Ball Z where two legendary saiyans
 * face off in an epic battle. Players use melee attacks, special moves, and
 * defensive blocking to defeat their opponent.
 *
 * Assets sources:
 * - Sprites: spriters-resource.com
 * - Backgrounds: open3dlab.com
 * - Sounds: freesound.org, opengameart.org
 * - Font: Google Fonts (Press Start 2P)
 */

import Game from "../lib/Game.js";
import {
    canvas,
    CANVAS_HEIGHT,
    CANVAS_WIDTH,
    context,
    stateMachine,
} from "./globals.js";
import TitleScreenState from "./states/game/TitleScreenState.js";
import ControlsScreenState from "./states/game/ControlsScreenState.js";
import PlayState from "./states/game/PlayState.js";
import GameStateName from "./enums/GameStateName.js";
import VictoryScreenState from "./states/game/VictoryScreenState.js";
import GameManager from "./services/GameManager.js";

// Set the dimensions of the play area.
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
canvas.setAttribute("tabindex", "1"); // Allows the canvas to receive user input.

// Now that the canvas element has been prepared, we can add it to the DOM.
document.body.prepend(canvas);

const mapDefinition = await fetch("./config/tilemap.json").then((response) =>
    response.json()
);

//Adds all the states to the state machine.
stateMachine.add(GameStateName.TitleScreen, new TitleScreenState());
stateMachine.add(GameStateName.ControlsScreen, new ControlsScreenState());
stateMachine.add(GameStateName.Play, new PlayState(mapDefinition));
stateMachine.add(GameStateName.VictoryScreen, new VictoryScreenState());

//Gets the saved state
const savedState = GameManager.load();

//Changes the game state based on the saved state
if (savedState) {
    switch (savedState.stateName) {
        case GameStateName.Play:
            stateMachine.change(GameStateName.Play, savedState.stateData);
            break;
        case GameStateName.VictoryScreen:
            stateMachine.change(
                GameStateName.VictoryScreen,
                savedState.stateData
            );
            break;
        case GameStateName.ControlsScreen:
            stateMachine.change(GameStateName.ControlsScreen);
            break;
        default:
            stateMachine.change(GameStateName.TitleScreen);
    }
} else {
    stateMachine.change(GameStateName.TitleScreen);
}

const game = new Game(stateMachine, context, canvas.width, canvas.height);

game.start();

// Focus the canvas so that the player doesn't have to click on it.
canvas.focus();
