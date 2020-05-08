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
     * @param {String} elementName
     * @param {String} componentName
     * @param {ObjectConstructor} componentConstructor
     */
    registerComponent(elementName, componentName, componentConstructor) {
        const descriptor = this.getOrCreateDescriptor(componentName);
        descriptor.factory = componentConstructor;
        descriptor.elementName = elementName;
    }

    /**
     * @param {String} componentName 
     * @returns {VueComponentDescriptor}
     */
    getOrCreateDescriptor(componentName) {
        if (!(componentName in this.#descriptors)) {
            this.#descriptors[componentName] = new VueComponentDescriptor(componentName);
        }
        return this.#descriptors[componentName];
    }

    /**
     * @param {String} componentName
     * @param {string[]} methods
     */
    registerComponentMethods(componentName, methods) {
        const descriptor = this.getOrCreateDescriptor(componentName);
        methods.forEach(method => { //TODO: Use the spread operator here, but you'll have to polyfill ie11
            descriptor.methods.push(method);
        });
    }

    /**
     * @param {String} componentName
     * @param {String} template
     */
    registerComponentTemplate(componentName, template) {
        this.getOrCreateDescriptor(componentName).template = template;
    }

    /**
     * @param {String} componentName
     * @param {String} propertyName
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
     * @type {String}
     */
    componentName;

    /**
     * @type {String}
     */
    elementName;

    /**
     * @type {ObjectConstructor}
     */
    factory;

    /**
     * @type {String[]}
     */
    methods = [];

    /**
     * @type {String[]}
     */
    computed = [];

    /**
     * @type {String[]}
     */
    properties = [];

    /**
     * @type {String}
     */
    template;

    /**
     * @param {String} componentName
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