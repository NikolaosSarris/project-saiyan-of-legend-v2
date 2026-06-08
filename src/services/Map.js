import Sprite from "../../lib/Sprite.js";
import ImageName from "../enums/ImageName.js";
import Tile from "./Tile.js";
import Layer from "./Layer.js";
import { images } from "../globals.js";

export default class Map {
    /**
     * The index of the foreground layer in the layers array.
     *
     * @type {number}
     */
    static FOREGROUND_LAYER = 0;

    /**
     * Creates a new Map instance.
     *
     * @param {Object} mapDefinition - The map definition object from a json file.
     */
    constructor(mapDefinition) {
        this.width = mapDefinition.width;
        this.height = mapDefinition.height;
        this.tileSize = mapDefinition.tilewidth;
        this.tilesets = mapDefinition.tilesets;

        //Generates sprites from the tileset image
        const sprites = Sprite.generateSpritesFromSpriteSheet(
            images.get(ImageName.Tiles),
            this.tileSize,
            this.tileSize
        );

        //Creates Layer instances for each layer in the map definition
        this.layers = mapDefinition.layers.map(
            (layerData) => new Layer(layerData, sprites)
        );
        this.foregroundLayer = this.layers[Map.FOREGROUND_LAYER];

        this.blocks = [];
    }

    /**
     * Updates all entities in the map.
     *
     * @param {number} dt - The time passed since the last update.
     */
    update(dt) {}

    /**
     * Renders the map and all its entities.
     */
    render() {
        this.foregroundLayer.render();
    }

    /**
     * Retrieves a block at the specified coordinates.
     *
     * @param {number} x - The x-coordinate.
     * @param {number} y - The y-coordinate.
     * @returns {Block|undefined} The block at the specified position, if any.
     */
    getBlockAt(x, y) {
        return this.blocks.find(
            (block) =>
                x >= block.position.x &&
                x < block.position.x + block.dimensions.x &&
                y >= block.position.y &&
                y < block.position.y + block.dimensions.y
        );
    }

    /**
     * Gets a tile from a specific layer at the given column and row.
     *
     * @param {number} layerIndex - The index of the layer.
     * @param {number} col - The column of the tile.
     * @param {number} row - The row of the tile.
     * @returns {Tile|null} The tile at the specified position, or null if no tile exists.
     */
    getTileAt(layerIndex, col, row) {
        return this.layers[layerIndex].getTile(col, row);
    }

    /**
     * Checks if there's a solid tile at the specified column and row.
     *
     * @param {number} col - The column to check.
     * @param {number} row - The row to check.
     * @returns {boolean} True if there's a solid tile, false otherwise.
     */
    isSolidTileAt(col, row) {
        const tile = this.foregroundLayer.getTile(col, row);
        return tile !== null && tile.id !== -1;
    }
}
