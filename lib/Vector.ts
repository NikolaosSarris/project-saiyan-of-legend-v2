export default class Vector {
	x: number;
	y: number;

	/**
	 * A simple vector class that can add two vectors together.
	 *
	 * @param {Number} x
	 * @param {Number} y
	 */
	constructor(x = 0, y = 0) {
		this.x = x;
		this.y = y;
	}

	set(x: number, y: number): void {
		this.x = x;
		this.y = y;
	}

	add(vector: Vector, dt = 1): void {
		this.x += vector.x * dt;
		this.y += vector.y * dt;
	}
}
