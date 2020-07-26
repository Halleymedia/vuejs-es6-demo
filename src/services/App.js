import Vue from 'vue/dist/vue';
import { componentRegistry } from 'services/ComponentRegistry';
import VueComponentAdapter from 'services/VueComponentAdapter';
import 'regenerator-runtime/runtime';
//Necessary to IE11
import 'core-js/features/symbol';
import 'core-js/features/promise';
import 'core-js/features/array/of';
import 'whatwg-fetch';
import 'regexp-polyfill';

class App {

    /**
     * @param {HTMLElement} rootElement
     * @param {(error: any) => void} errorHandler
     */
    constructor(rootElement, errorHandler) {
        //@ts-ignore
        Vue.config.errorHandler = errorHandler;
        this.createVueApp(rootElement);
    }

    /**
     * Installs Vue on the container element
     * @param {HTMLElement} el
     * @returns {Vue}
     */
    createVueApp(el) {
        const components = this.generateVueComponents();
        const template = '<main-layout></main-layout>';
        //@ts-ignore
        return new Vue({ el, template, components });
    }

    
    /**
     * Registers modules found in the app as Vue Components
     * @returns {Object.<string, VueComponentAdapter>}
     */
    generateVueComponents() {
        /**
        * @type {Object.<string, VueComponentAdapter>}
        */
        const components = {};
        componentRegistry.descriptors.forEach(descriptor => {
            const component = new VueComponentAdapter(descriptor, components);
            components[descriptor.elementName] = component;
        });
        return components;
    }
}

export default App;