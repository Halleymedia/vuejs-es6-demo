import { Component } from 'services/Decorators';
import template from './LoadingIndicator.html';

@Component('loading-indicator', template)
class LoadingIndicator {
    /**
     * @type {boolean|undefined}
     */
    animated;
}
export default LoadingIndicator;