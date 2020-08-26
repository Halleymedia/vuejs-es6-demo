import { Component } from 'services/Decorators'
import { router } from 'services/Router'
import { componentRegistry } from 'services/ComponentRegistry'
import template from './MainLayout.html'

@Component('main-layout', template)
class MainLayout {
    /**
     * @type {string|undefined}
     */
    component;

    /**
     * @type {string|undefined}
     */
    title;

    constructor () {
      router.onNavigated(this.onNavigated.bind(this))
    }

    /**
     * @param {string} elementName
     * @param {any} params
     * @param {string} title
     */
    async onNavigated (elementName, params, title) {
      this.component = elementName
      this.title = title
      componentRegistry.setComponentParams(elementName, params)
    }
}
export default MainLayout
