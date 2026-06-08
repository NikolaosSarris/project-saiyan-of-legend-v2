export default class Graphic {
    image: HTMLImageElement;
    width: number;
    height: number;
    context: CanvasRenderingContext2D;

    /**
     * A wrapper for creating/loading a new Image() object.
     *
     * @param {String} path
     * @param {Number} width
     * @param {Number} height
     * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/Image
     */
    constructor(path: string, width: number, height: number, context: CanvasRenderingContext2D) {
        this.image = new Image(width, height);
        this.image.src = path;
        this.width = width;
        this.height = height;
        this.context = context;
    }

    render(x: number, y: number, width = this.width, height = this.height): void {
        this.context.drawImage(
            this.image,
            Math.floor(x),
            Math.floor(y),
            width,
            height
        );
    }
}
