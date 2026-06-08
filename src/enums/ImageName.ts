const ImageName = {
    Tiles: "tiles",
    Background: "background",
    TitleScreen: "title_screen",
    Goku: "goku",
    Vegeta: "vegeta",
} as const;

export type ImageName = typeof ImageName[keyof typeof ImageName];

export default ImageName;
