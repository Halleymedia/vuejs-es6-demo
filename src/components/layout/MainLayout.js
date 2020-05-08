import { component } from 'services/decorators'; 
import router from 'services/router';
import app from 'services/app';

@component('main-layout')
export default class MainLayout {

    /**
     * @type {String}
     */
    componentName;

    /**
     * @type {String}
     */
    title;

    constructor() {
        router.onNavigated(this.onNavigated.bind(this));
    }

    /**
     * @param {String} componentName
     * @param {any} params
     * @param {String} title
     */
    async onNavigated(componentName, params, title) {
        this.componentName = componentName;
        this.title = title;
        app.setComponentParams(componentName, params);
    }
}