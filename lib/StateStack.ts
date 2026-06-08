import State from './State';

export default class StateStack {
	states: State[];

	constructor() {
		this.states = [];
	}

	update(dt: number): void {
		this.top().update(dt);
	}

	render(context: CanvasRenderingContext2D): void {
		this.states.forEach((state) => state.render(context));
	}

	push(state: State): void {
		this.states.push(state);
		this.top().enter();
	}

	pop(): State {
		this.top().exit();
		return this.states.splice(this.states.length - 1, 1)[0];
	}

	top(): State {
		return this.states[this.states.length - 1];
	}

	clear(): void {
		this.states = [];
	}
}
