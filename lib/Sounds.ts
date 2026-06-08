import SoundPool from "./SoundPool";

export interface SoundDefinition {
	name: string;
	path: string;
	size?: number;
	volume: number;
	loop?: boolean;
}

export default class Sounds {
	sounds: Record<string, SoundPool>;

	constructor() {
		this.sounds = {};
	}

	load(soundDefinitions: SoundDefinition[]): void {
		soundDefinitions.forEach((soundDefinition) => {
			this.sounds[soundDefinition.name] = new SoundPool(
				soundDefinition.path,
				soundDefinition.size,
				soundDefinition.volume,
				soundDefinition.loop,
			);
		});
	}

	get(name: string): SoundPool {
		return this.sounds[name];
	}

	play(name: string): void {
		this.get(name).play();
	}

	pause(name: string): void {
		this.get(name).pause();
	}

	stop(name: string): void {
		this.get(name).stop();
	}
}
