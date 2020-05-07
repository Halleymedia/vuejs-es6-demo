export default class PokemonResultDto {

    /**
     * @param {number} id
     * @param {string} name
     */
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }

    /** @type {number} */
    id;

    /** @type {string} */
    name;
    
    /** @type {string} */
    get url() {
        return `/pokemon/${this.id}`;
    };
}