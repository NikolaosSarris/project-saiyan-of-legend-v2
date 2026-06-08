import MoveType from "../enums/MoveType.js";
import Move from "./Move.js";

export default class MoveFactory {
    /**
     * Creates a basic punch attack.
     *
     * @param {number} fighterWidth - The width of the fighter sprite.
     * @param {number} fighterHeight - The height of the fighter sprite.
     * @returns {Move} A punch move.
     */
    static createPunch(fighterWidth, fighterHeight) {
        return new Move(
            MoveType.Punch,
            10,
            {
                x: fighterWidth,
                y: fighterHeight * 0.2,
                width: 20,
                height: fighterHeight * 0.6,
            },
            {
                x: -10,
                y: fighterHeight * 0.2,
                width: 20,
                height: fighterHeight * 0.6,
            }
        );
    }

    /**
     * Creates a beam special attack.
     *
     * @param {number} fighterWidth - The width of the fighter sprite.
     * @param {number} fighterHeight - The height of the fighter sprite.
     * @returns {Move} A beam move.
     */
    static createBeamAttack(fighterWidth, fighterHeight) {
        return new Move(
            MoveType.Beam,
            30,
            {
                x: fighterWidth,
                y: fighterHeight * 0.3,
                width: 400,
                height: fighterHeight * 0.4,
            },
            {
                x: -400,
                y: fighterHeight * 0.3,
                width: 400,
                height: fighterHeight * 0.4,
            }
        );
    }
}
