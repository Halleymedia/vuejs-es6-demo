import App from 'services/App.js';
/**
 * @type {any}
 */
const global = typeof window !== 'undefined' ? window : globalThis;
global['App'] = App;