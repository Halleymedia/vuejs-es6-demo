import 'regenerator-runtime/runtime';
//Necessary to IE11
import 'core-js/features/symbol';
import 'core-js/features/promise';
import 'core-js/features/array/of';
import 'whatwg-fetch';
import 'regexp-polyfill';

import App from 'services/App.js';

/**
 * Imports all components since they're not statically referenced with import. 
 * @param {any} requireResult
 */
function importAll(requireResult) {
    return requireResult.keys().map(requireResult);
}
importAll(require.context('./components', true, /\.(js|scss)$/));

/**
 * @type {any}
 */
const global = typeof window !== 'undefined' ? window : globalThis;
global['App'] = App;