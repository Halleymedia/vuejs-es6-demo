import { Component } from 'services/Decorators'; 
import template from './MainLayout.html';
import router from 'services/Router';

@Component('main-layout', template)
class MainLayout {

    /**
     * @type {string|undefined}
     */
    componentName;

    /**
     * @type {string|undefined}
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
        //app.setComponentParams(componentName, params);
    }
}
export default MainLayout;