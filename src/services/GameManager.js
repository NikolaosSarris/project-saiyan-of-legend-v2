import GameStateName from "../enums/GameStateName.js";

export default class GameManager {
    static STATE_KEY = "dragonball-game-state";
    static WINS_KEY = "dragonball-wins";

    /**
     * Saves the current game state to sessionStorage.
     *
     * @param {string} currentStateName - The current game state.
     * @param {object} stateData - Additional data specific to the state.
     */
    static save(currentStateName, stateData = {}) {
        //Adds the current game state data to an object
        const saveData = {
            stateName: currentStateName,
            stateData: stateData,
        };

        //Tries to saves the game state
        try {
            sessionStorage.setItem(
                GameManager.STATE_KEY,
                JSON.stringify(saveData)
            );
        } catch (error) {
            console.error("Failed to save game state:", error);
        }
    }

    /**
     * Loads the saved game state from sessionStorage.
     *
     * @returns {object|null} - The saved state data, or null if no save exists.
     */
    static load() {
        //Tries to load the game state
        try {
            //Retrieves the saved game state
            const savedData = sessionStorage.getItem(GameManager.STATE_KEY);

            //If there is no saved state, returns null
            if (!savedData) {
                return null;
            }

            //Parses the saved game state
            return JSON.parse(savedData);
        } catch (error) {
            console.error("Failed to load game state:", error);
            return null;
        }
    }

    /**
     * Saves PlayState data.
     *
     * @param {object} player1 - The first player object.
     * @param {object} player2 - The second player object.
     */
    static savePlayState(player1, player2) {
        //Adds the play state data to an object
        const playStateData = {
            player1: {
                position: { x: player1.position.x, y: player1.position.y },
                velocity: { x: player1.velocity.x, y: player1.velocity.y },
                health: player1.health,
                isFacingRight: player1.isFacingRight,
                currentStateName: player1.stateMachine.currentState.name,
                playerNumber: player1.playerNumber,
                name: player1.name,
            },
            player2: {
                position: { x: player2.position.x, y: player2.position.y },
                velocity: { x: player2.velocity.x, y: player2.velocity.y },
                health: player2.health,
                isFacingRight: player2.isFacingRight,
                currentStateName: player2.stateMachine.currentState.name,
                playerNumber: player2.playerNumber,
                name: player2.name,
            },
        };

        //Saves the play state
        GameManager.save(GameStateName.Play, playStateData);

        //Saves the wins
        GameManager.saveWins(player1.wins, player2.wins);
    }

    /**
     * Saves TitleScreen state.
     */
    static saveTitleScreen() {
        GameManager.save(GameStateName.TitleScreen, {});
    }

    /**
     * Saves ControlsScreen state.
     */
    static saveControlsScreen() {
        GameManager.save(GameStateName.ControlsScreen, {});
    }

    /**
     * Saves the victory state of the game.
     *
     * @param {string} winnerName - The name of the winning player.
     * @param {number} player1Wins - The number of wins of the first player.
     * @param {number} player2Wins - The number of wins of the second player.
     */
    static saveVictoryScreen(winnerName, player1Wins, player2Wins) {
        GameManager.save(GameStateName.VictoryScreen, {
            winnerName: winnerName,
            player1Wins: player1Wins,
            player2Wins: player2Wins,
        });

        GameManager.saveWins(player1Wins, player2Wins);
    }

    /**
     * Saves just the wins
     */
    static saveWins(player1Wins, player2Wins) {
        try {
            sessionStorage.setItem(
                GameManager.WINS_KEY,
                JSON.stringify({
                    player1Wins: player1Wins,
                    player2Wins: player2Wins,
                })
            );
        } catch (error) {
            console.error("Failed to save wins:", error);
        }
    }

    /**
     * Loads the saved wins
     */
    static loadWins() {
        try {
            const savedWins = sessionStorage.getItem(GameManager.WINS_KEY);

            if (!savedWins) {
                return { player1Wins: 0, player2Wins: 0 };
            }

            return JSON.parse(savedWins);
        } catch (error) {
            console.error("Failed to load wins:", error);
            return { player1Wins: 0, player2Wins: 0 };
        }
    }
}
