import { Component } from 'services/Decorators';
import template from './LoadingIndicator.html';

@Component('loading-indicator', template)
class LoadingIndicator {
    /**
     * @param {boolean|undefined} value
     */
    set animated(value) {
        //TODO: do something with value
        console.log("The animated property was set to", value)
    }
}
export default LoadingIndicator;