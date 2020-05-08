export default class PokemonResultDto {

    /**
     * @param {number} id
     * @param {String} name
     */
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }

    /** @type {number} */
    id;

    /** @type {String} */
    name;
    
    /** @type {String} */
    get url() {
        return `/pokemon/${this.id}`;
    };
}