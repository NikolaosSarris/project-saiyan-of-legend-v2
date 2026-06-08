/**
 * States are only created as needed, to save memory, reduce clean-up bugs and
 * increase speed due to garbage collection taking longer with more data in memory.
 *
 * States are added with a string identifier and a State object.
 *
 * const stateMachine = new StateMachine();
 *
 * stateMachine.add('main-menu', new MainMenuState());
 * stateMachine.add('play', new PlayState());
 * stateMachine.add('game-over', new GameOverState());
 *
 * stateMachine.change('MainMenuState', {});
 *
 * Arguments passed into the change() function after the state name will
 * be forwarded to the enter() function of the state being changed to.
 *
 * State identifiers should be the lower-case kebab-case version of
 * the state object without the 'State' suffix.
 * ex. 'main-menu' identifies a state object of type MainMenuState.
 */
import State from './State';

export default class StateMachine {
	states: Record<string, State>;
	currentState!: State;

	constructor() {
		this.states = {};
	}

	add(stateName: string, state: State): void {
		state.name = stateName;
		this.states[stateName] = state;
		this.currentState = state;
	}

	change(stateName: string, enterParameters?: unknown): void {
		this.currentState.exit();
		this.currentState = this.states[stateName];
		this.currentState.enter(enterParameters);
	}

	update(dt: number): void {
		this.currentState.update(dt);
	}

	render(context: CanvasRenderingContext2D): void {
		this.currentState.render(context);
	}
}
