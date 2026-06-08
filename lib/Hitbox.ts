import { getCollisionDirection, isAABBCollision } from "./Collision";
import Vector from "./Vector";

export default class Hitbox {
    colour: string;
    position!: Vector;
    dimensions!: Vector;

    /**
     * A rectangle that represents the area around a game
     * entity or object that can collide with other hitboxes.
     *
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @param {number} height
     * @param {string} colour
     */
    constructor(x = 0, y = 0, width = 0, height = 0, colour = "red") {
        this.colour = colour;
        this.set(x, y, width, height);
    }

    set(x: number, y: number, width: number, height: number): void {
        this.position = new Vector(x, y);
        this.dimensions = new Vector(width, height);
    }

    didCollide(target: Hitbox): boolean {
        return isAABBCollision(
            this.position.x,
            this.position.y,
            this.dimensions.x,
            this.dimensions.y,
            target.position.x,
            target.position.y,
            target.dimensions.x,
            target.dimensions.y
        );
    }

    getCollisionDirection(target: Hitbox): number {
        return getCollisionDirection(
            this.position.x,
            this.position.y,
            this.dimensions.x,
            this.dimensions.y,
            target.position.x,
            target.position.y,
            target.dimensions.x,
            target.dimensions.y
        );
    }

    render(context: CanvasRenderingContext2D): void {
        context.save();
        context.strokeStyle = this.colour;
        context.beginPath();
        context.rect(
            this.position.x,
            this.position.y,
            this.dimensions.x,
            this.dimensions.y
        );
        context.stroke();
        context.closePath();
        context.restore();
    }
}
