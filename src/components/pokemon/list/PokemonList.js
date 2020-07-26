import { Component } from 'services/Decorators';
import template from './PokemonList.html';
import PokemonResultDto from 'models/PokemonResultDto';
import client from 'services/Client';

@Component('pokemon-list', template, '^/$', 'Pokémon list')
class PokemonList {

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

export default PokemonList;