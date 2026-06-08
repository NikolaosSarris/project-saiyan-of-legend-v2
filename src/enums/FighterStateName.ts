const FighterStateName = {
    Idling: "idling",
    Walking: "walking",
    Jumping: "jumping",
    Falling: "falling",
    Dying: "dying",
    Blocking: "blocking",
    TakingDamage: "takingDamage",
    Attacking: "attacking",
    Special1: "special1",
} as const;

export type FighterStateName = typeof FighterStateName[keyof typeof FighterStateName];

export default FighterStateName;
