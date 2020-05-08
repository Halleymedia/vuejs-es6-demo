import { component } from 'services/decorators';
import PokemonDetailDto from 'models/PokemonDetailDto';
import client from 'services/client';

@component('pokemon-detail', '/pokemon/(?<id>[0-9]+)/?', 'Pokémon detailed info')
export default class PokemonDetail {

    /** @type {PokemonDetailDto|null} */
    result = null;

    /**
     * @param {Object} obj
     * @param {Number} obj.id
     */
    constructor({id}) //This is the same <id> that was captured in the URL
    {
        this.load(id);
    }

    /** @param {Number} id */
    async load(id) {
        const result = await client.getPokemon(id);
        this.result = result;
    }
}