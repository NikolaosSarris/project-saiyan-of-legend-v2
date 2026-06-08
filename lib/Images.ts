import Graphic from "./Graphic";

export interface ImageDefinition {
    name: string;
    path: string;
    width: number;
    height: number;
}

export default class Images {
    context: CanvasRenderingContext2D;
    images: Record<string, Graphic>;

    constructor(context: CanvasRenderingContext2D) {
        this.context = context;
        this.images = {};
    }

    load(imageDefinitions: ImageDefinition[]): void {
        imageDefinitions.forEach((imageDefinition) => {
            this.images[imageDefinition.name] = new Graphic(
                imageDefinition.path,
                imageDefinition.width,
                imageDefinition.height,
                this.context
            );
        });
    }

    get(name: string): Graphic {
        return this.images[name];
    }

    render(name: string, x: number, y: number, width: number | null = null, height: number | null = null): void {
        const image = this.get(name);

        image.render(x, y, width ?? image.width, height ?? image.height);
    }
}
