const GameStateName = {
    TitleScreen: "title-screen",
    ControlsScreen: "controls-screen",
    Play: "play",
    VictoryScreen: "victory-screen",
} as const;

export type GameStateName = typeof GameStateName[keyof typeof GameStateName];

export default GameStateName;
