import 'regenerator-runtime/runtime'
// Necessary to IE11
import 'core-js/features/symbol'
import 'core-js/features/promise'
import 'core-js/features/array/of'
import 'whatwg-fetch'
import 'regexp-polyfill'

import App from 'services/App.js'
import localization from './localization.json'

/**
 * Imports all components since they're not statically referenced with import.
 * @param {any} requireResult
 */
function importAll (requireResult) {
  return requireResult.keys().map(requireResult)
}
importAll(require.context('./components', true, /\.(js|scss)$/))

/**
 * @type {any}
 */
const global = window
global.App = App
global.localization = localization
