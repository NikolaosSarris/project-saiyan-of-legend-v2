import Easing, { EasingFunction } from './Easing';

/**
 * Uses delta time passed in from our game loop to keep track of individual
 * tasks over a given period of time. You can specify an action to be done at
 * each interval of time, or only once after a duration. There is also a tween
 * function that makes use of the timer mechanism to interpolate a value between
 * a start and end value.
 */
export default class Timer {
	tasks: Task[];

	constructor() {
		this.tasks = [];
	}

	update(dt: number): void {
		this.removeFinishedTasks();
		this.updateTasks(dt);
	}

	/**
	 * Adds a task to the timer's list of tasks to be run.
	 *
	 * @param {function} action The function to execute after a certain period of time.
	 * @param {number} interval How often the action should execute (frequency).
	 * @param {number} duration How long the task will be tracked in this.tasks.
	 * @param {function} callback The function to execute after duration has passed.
	 */
	addTask(action: (time?: number) => void, interval: number, duration = 0, callback: () => void = () => {}): void {
		this.tasks.push(new Task(action, interval, duration, callback));
	}

	/**
	 * Loops through the tasks and updates them accordingly based on delta time.
	 *
	 * @param {number} dt How much time has elapsed since the last time this was called.
	 */
	updateTasks(dt: number): void {
		this.tasks.forEach((task) => {
			task.update(dt);
		});
	}

	/**
	 * Removes the finished tasks by looping through each tasks and checking the isDone flag.
	 *
	 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
	 */
	removeFinishedTasks(): void {
		this.tasks = this.tasks.filter((task) => !task.isDone);
	}

	clear(): void {
		this.tasks = [];
	}

	/**
	 * Interpolate a value until a specified value is reached over a specified period of time in seconds.
	 *
	 * @param {object} object An object that has at least one numerical property to interpolate.
	 * @param {array} parameters The properties of the object to interpolate (as strings) and the final numerical values the parameters should reach.
	 * @param {number} duration How long the interpolation should take.
	 * @param {function} callback The function to execute after duration has passed.
	 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	tween(
		object: any,
		parameters: Record<string, number>,
		duration: number,
		easing: EasingFunction = Easing.linear,
		callback: () => void = () => {}
	): void {
		const startingValues: Record<string, number> = {};
		const keys = Object.keys(parameters);
		keys.forEach((key) => {
			startingValues[key] = object[key];
		});

		this.addTask(
			(time) => {
				keys.forEach((key) => {
					// Calculate the direction in case we have to tween values from high to low.
					const direction =
						parameters[key] - object[key] > 0 ? 1 : -1;
					const startValue = startingValues[key];
					const endValue = parameters[key];
					const currentValue = easing(
						time!,
						startValue,
						endValue - startValue,
						duration
					);

					if (direction === 1) {
						object[key] = Math.min(endValue, currentValue);
					} else {
						object[key] = Math.max(endValue, currentValue);
					}
				});
			},
			0,
			duration,
			callback
		);
	}

	async tweenAsync(object: any, parameters: Record<string, number>, duration: number, easing: EasingFunction = Easing.linear): Promise<void> {
		return new Promise((resolve) => {
			this.tween(object, parameters, duration, easing, resolve);
		});
	}

	async wait(duration: number): Promise<void> {
		return new Promise((resolve) => {
			this.addTask(() => {}, 0, duration, resolve);
		});
	}
}

class Task {
	action: (time?: number) => void;
	interval: number;
	intervalTimer: number;
	totalTime: number;
	duration: number;
	callback: () => void;
	isDone: boolean;

	/**
	 * Represents an action to be done after a certain period of time.
	 *
	 * @param {function} action The function to execute after a certain period of time.
	 * @param {number} interval How often the action should execute (frequency).
	 * @param {number} duration How long the task will be tracked in this.tasks.
	 * @param {function} callback The function to execute after duration has passed.
	 */
	constructor(action: (time?: number) => void, interval: number, duration = 0, callback: () => void = () => {}) {
		this.action = action;
		this.interval = interval;
		this.intervalTimer = 0;
		this.totalTime = 0;
		this.duration = duration;
		this.callback = callback;
		this.isDone = false;
	}

	update(dt: number): void {
		this.intervalTimer += dt; // Counts from 0 until interval.
		this.totalTime += dt; // Counts from 0 until duration.

		// An interval of 0 means we're tweening.
		if (this.interval === 0) {
			this.action(this.totalTime);
		}
		// Otherwise, at every interval, execute the action.
		else if (this.intervalTimer >= this.interval) {
			this.action();
			this.intervalTimer = 0;
		}

		// At the end of the duration, execute the callback.
		if (this.duration !== 0 && this.totalTime >= this.duration) {
			this.callback();
			this.isDone = true;
		}
	}
}
