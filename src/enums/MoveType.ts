const MoveType = {
    Punch: "punch",
    Beam: "beam",
} as const;

export type MoveType = typeof MoveType[keyof typeof MoveType];

export default MoveType;
