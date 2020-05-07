import app from 'services/app';
import router from 'services/router';

const getTargetName = (target) => target.toString();

/**
 * @param {string} elementName
 * @param {string|null} [route]
 * @param {string|null} [title]
 */
export const component = (elementName, route = null, title = null) => 
    /** @type {any} */ (target => {
        app.registerComponent(elementName, getTargetName(target), target);
        const methods = Object.getOwnPropertyNames(target.prototype).filter(name => name != 'constructor');
        app.registerComponentMethods(target.toString(), methods);

        if (route) {
            router.addRoute(elementName, route, title);
        }
    });

/**
 * @param {string} template
 */
export const template = (template) => 
    /** @type {any} */ (target => {
        app.registerComponentTemplate(getTargetName(target), template);
    });


export const property = /** @type {any} */ (target, targetName, descriptor) => {
        app.registerComponentProperty(getTargetName(target.constructor), targetName);
        descriptor.enumerable = false;
        return descriptor;
    };