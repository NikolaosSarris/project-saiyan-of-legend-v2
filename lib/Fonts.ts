export interface FontDefinition {
	name: string;
	path: string;
}

export default class Fonts {
	fonts: Record<string, FontFace>;

	constructor() {
		this.fonts = {};
	}

	load(fontDefinitions: FontDefinition[]): void {
		fontDefinitions.forEach((fontDefinition) => {
			const font = new FontFace(
				fontDefinition.name,
				`url(${fontDefinition.path})`
			);

			this.fonts[fontDefinition.name] = font;

			font.load().then(font => {
				document.fonts.add(font);
			});
		});
	}

	get(name: string): FontFace {
		return this.fonts[name];
	}
}
