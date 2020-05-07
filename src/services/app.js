import Vue from 'vue/dist/vue';
import 'regenerator-runtime/runtime';
//Necessary to IE11
import 'core-js/features/symbol';
import 'core-js/features/promise';
import 'core-js/features/array/of';
import 'whatwg-fetch';
import 'regexp-polyfill';

class App {

    /**
     * @type {Object.<string, VueComponentDescriptor>}
     */
    #descriptors = {};

    /**
     * @param {HTMLElement} rootElement
     * @param {(error: any) => void} errorHandler
     */
    static bootstrap(rootElement, errorHandler) {
        Vue.config.errorHandler = errorHandler;
        app.bootstrapComponents();
        app.bootstrapVue(rootElement);
    }

    bootstrapComponents() {
        for (const el in this.#descriptors) {
            const descriptor = this.#descriptors[el];
            Vue.component(descriptor.elementName, new VueComponentAdapter(descriptor));
        }
    }

    /**
     * @param {HTMLElement} rootElement 
     */
    bootstrapVue(rootElement) {
        new Vue({ el: rootElement, template: '<main-layout></main-layout>' });
    }

    /**
     * @param {string} elementName
     * @param {string} componentName
     * @param {ObjectConstructor} componentConstructor
     */
    registerComponent(elementName, componentName, componentConstructor) {
        const descriptor = this.getOrCreateDescriptor(componentName);
        descriptor.factory = componentConstructor;
        descriptor.elementName = elementName;
    }

    /**
     * @param {string} componentName 
     * @returns {VueComponentDescriptor}
     */
    getOrCreateDescriptor(componentName) {
        if (!(componentName in this.#descriptors)) {
            this.#descriptors[componentName] = new VueComponentDescriptor(componentName);
        }
        return this.#descriptors[componentName];
    }

    /**
     * @param {string} componentName
     * @param {string[]} methods
     */
    registerComponentMethods(componentName, methods) {
        const descriptor = this.getOrCreateDescriptor(componentName);
        methods.forEach(method => { //TODO: Use the spread operator here, but you'll have to polyfill ie11
            descriptor.methods.push(method);
        });
    }

    /**
     * @param {string} componentName
     * @param {string} template
     */
    registerComponentTemplate(componentName, template) {
        this.getOrCreateDescriptor(componentName).template = template;
    }

    /**
     * @param {string} componentName
     * @param {string} propertyName
     */
    registerComponentProperty(componentName, propertyName) {
        this.getOrCreateDescriptor(componentName).properties.push(propertyName);
    }

    setComponentParams(elementName, params) {
        for (const componentName in this.#descriptors) {
            if (this.#descriptors[componentName].elementName == elementName) {
                this.#descriptors[componentName].params = params;
            }
        }
    }
}

class VueComponentDescriptor {

    /**
     * @type {any}
     */
    params;

    /**
     * @type {string}
     */
    componentName;

    /**
     * @type {string}
     */
    elementName;

    /**
     * @type {ObjectConstructor}
     */
    factory;

    /**
     * @type {string[]}
     */
    methods = [];

    /**
     * @type {string[]}
     */
    computed = [];

    /**
     * @type {string[]}
     */
    properties = [];

    /**
     * @type {string}
     */
    template;

    /**
     * @param {string} componentName
     */
    constructor(componentName) {
        this.componentName = componentName;
    }
}

class VueComponentAdapter {

    /**
     * @type {VueComponentDescriptor}
     */
    #componentDescriptor;

    /**
     * @param {VueComponentDescriptor} componentDescriptor
     */
    constructor(componentDescriptor) {
        this.#componentDescriptor = componentDescriptor;
        Object.defineProperty(this, 'methods', { configurable: false, enumerable: true, get: this.getMethods });
        Object.defineProperty(this, 'template', { configurable: false, enumerable: true, get: this.getTemplate });
        Object.defineProperty(this, 'data', { configurable: false, enumerable: true, get: this.getData});
        Object.defineProperty(this, 'props', { configurable: false, enumerable: true, get: this.getProps, set: () => {}});
    }

    getMethods() {
        const methods = {};
        const proto = this.#componentDescriptor.factory.prototype;
        this.#componentDescriptor.methods
            .filter(method => this.#componentDescriptor.properties.indexOf(method) < 0)
            .forEach(method => methods[method] = proto[method]);
        return methods;
    }

    getTemplate() {
        return this.#componentDescriptor.template;
    }

    getData() {
        return () => new this.#componentDescriptor.factory(this.#componentDescriptor.params);
    }

    getProps() {
        var props = {};
        this.#componentDescriptor.properties.forEach(prop => props[prop] = Object);
        return props;
    }
}

const app = new App();
global['App'] = App;
export default app;