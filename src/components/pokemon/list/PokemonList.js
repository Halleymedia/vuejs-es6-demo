import { Component } from 'services/Decorators'
import template from './PokemonList.html'
import client from 'services/Client'

@Component('pokemon-list', template, '^/$', 'Pokémon list')
class PokemonList {
    /**
     * @type {import('models/PokemonResultDto').default[]|undefined}
     */
    results;

    constructor () {
      this.load()
    }

    async load () {
      this.results = await client.listPokemon()
    }
}

export default PokemonList
