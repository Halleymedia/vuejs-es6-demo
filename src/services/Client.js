import PokemonResultDto from 'models/PokemonResultDto'
import PokemonDetailDto from 'models/PokemonDetailDto'

const baseUri = 'https://pokeapi.co/api/v2'

/**
 * @param {String} [method]
 * @param {String} [path]
 * @returns {Promise<any>}
 */
const request = async (method, path) => {
  const response = await window.fetch(`${baseUri}/${path}`, { method })
  const data = await response.json()
  return data
}

class Client {
  /**
     * @returns {Promise<PokemonResultDto[]>}
     */
  async listPokemon () {
    const data = await request('get', 'pokemon')
    const pokemonList = []
    for (const entry of data.results) {
      if (!entry) {
        continue
      }
      const match = /pokemon\/(.+)\//.exec(entry.url || '')
      if (!match || !match[1]) {
        continue
      }
      const id = parseInt(match[1], 10)
      const pokemonItem = new PokemonResultDto(id, entry.name)
      pokemonList.push(pokemonItem)
    }
    return pokemonList
  }

  /**
     * @returns {Promise<PokemonDetailDto>}
     * @param {number} id
     */
  async getPokemon (id) {
    const data = await request('get', `pokemon/${id}`)
    return new PokemonDetailDto(
      data.id,
      data.name,
      data.sprites.front_default,
      data.types.map(/** @param {any} entry */ entry => entry.type.name),
      data.moves.map(/** @param {any} entry */ entry => entry.move.name)
    )
  }
}

export default new Client()
