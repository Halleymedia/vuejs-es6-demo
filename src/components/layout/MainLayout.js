import { component } from 'services/decorators'; 
import router from 'services/router';
import app from 'services/app';

@component('main-layout')
export default class MainLayout {

    /**
     * @type {string}
     */
    componentName;

    /**
     * @type {string}
     */
    title;

    constructor() {
        router.onNavigated(this.onNavigated.bind(this));
    }

    /**
     * @param {string} componentName
     * @param {any} params
     * @param {string} title
     */
    async onNavigated(componentName, params, title) {
        this.componentName = componentName;
        this.title = title;
        app.setComponentParams(componentName, params);
    }
}