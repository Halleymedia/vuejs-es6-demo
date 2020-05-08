export default class PokemonDetailDto {

    /**
     * @param {number} id
     * @param {String} name
     * @param {String} picture
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

    /** @type {String} */
    name;

    /** @type {String} */
    picture;

    /** @type {String[]} */
    types;

    /** @type {String[]} */
    moves;
}