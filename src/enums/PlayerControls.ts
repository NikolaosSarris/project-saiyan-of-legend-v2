import Input from "../../lib/Input";

export interface PlayerControlMap {
    moveLeft: string;
    moveRight: string;
    jump: string;
    block: string;
    attack: string;
    special1: string;
    special2: string;
    special3: string;
}

export const PlayerControls: Record<1 | 2, PlayerControlMap> = {
    1: {
        moveLeft: Input.KEYS.A,
        moveRight: Input.KEYS.D,
        jump: Input.KEYS.W,
        block: Input.KEYS.S,
        attack: Input.KEYS.E,
        special1: Input.KEYS[1],
        special2: Input.KEYS[2],
        special3: Input.KEYS[3],
    },
    2: {
        moveLeft: Input.KEYS.J,
        moveRight: Input.KEYS.L,
        jump: Input.KEYS.I,
        block: Input.KEYS.K,
        attack: Input.KEYS.O,
        special1: Input.KEYS[7],
        special2: Input.KEYS[8],
        special3: Input.KEYS[9],
    },
};
