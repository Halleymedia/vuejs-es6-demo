import { component } from 'services/decorators';
import PokemonResultDto from 'models/PokemonResultDto';
import client from 'services/client';

@component('pokemon-list', '^/$', 'Pokémon list')
export default class PokemonList {

    /**
     * @type {PokemonResultDto[]|null}
     */
    results = null;

    constructor() {
        this.load();
    }

    async load() {
        this.results = await client.listPokemon();
    }
}