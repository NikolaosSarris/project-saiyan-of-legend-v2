const Colour = {
    Black: "black",
    White: "white",
    Blue: "blue",
    Gold: "gold",
    Green: "green",
    Red: "red",
    Yellow: "yellow",
} as const;

export type Colour = typeof Colour[keyof typeof Colour];

export default Colour;
