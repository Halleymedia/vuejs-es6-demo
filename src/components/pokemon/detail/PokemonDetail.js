import { Component } from 'services/Decorators';
import template from './PokemonDetail.html';
import PokemonDetailDto from 'models/PokemonDetailDto';
import client from 'services/Client';

@Component('pokemon-detail', template, '/pokemon/(?<id>[0-9]+)/?', 'Pokémon detailed info')
class PokemonDetail {

    /** @type {PokemonDetailDto|null} */
    result;

    /**
     * @param {Object} obj
     * @param {Number} obj.id
     */
    constructor({id}) //This is the same <id> that was captured in the URL
    {
        this.result = null;
        this.load(id);
    }

    /** @param {Number} id */
    async load(id) {
        const result = await client.getPokemon(id);
        this.result = result;
    }
}

export default PokemonDetail;