export default class PokemonDetailDto {

    /**
     * @param {number} id
     * @param {string} name
     * @param {string} picture
     * @param {string[]} types
     * @param {string[]} moves
     */
    constructor(id, name, picture, types, moves) {
        this.id = id;
        this.name = name;
        this.picture = picture;
        this.types = types;
        this.moves = moves;
    }

    /** @type {number} */
    id;

    /** @type {string} */
    name;

    /** @type {string} */
    picture;

    /** @type {string[]} */
    types;

    /** @type {string[]} */
    moves;
}