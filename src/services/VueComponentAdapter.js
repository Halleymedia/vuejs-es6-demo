export default class VueComponentAdapter {
    /**
     * @type {import('services/VueComponentDescriptor').default}
     */
    #componentDescriptor;

    /**
     * @param {import('services/VueComponentDescriptor').default} componentDescriptor
     * @param {Object.<string, VueComponentAdapter>} components
     */
    constructor (componentDescriptor, components) {
      this.#componentDescriptor = componentDescriptor
      const props = this.getProps()
      this.props = props
      this.components = components
      const parseValue = this.#parseValue
      Object.defineProperty(this, 'methods', { configurable: false, enumerable: true, get: this.getMethods })
      Object.defineProperty(this, 'template', { configurable: false, enumerable: true, get: this.getTemplate })
      Object.defineProperty(this, 'data', { configurable: false, enumerable: true, get: this.getData })
      Object.defineProperty(this, 'computed', { configurable: false, enumerable: true, get: this.getComputed, set: () => {} })
      Object.defineProperty(this, 'watch', { configurable: false, enumerable: true, get: this.getWatch, set: () => {} })
      Object.defineProperty(this, 'mounted', {
        configurable: false,
        enumerable: true,
        value: function () {
        /**
             * @type {any}
             */
          const vueComponent = this
          const componentInstance = vueComponent.$data
          const containerElement = vueComponent.$el
          props.forEach(/** @param {string} prop */ prop => {
            componentInstance[prop] = parseValue(vueComponent[prop])
          })
          /**
             * @type {any}
             */
          const componentPrototype = componentInstance.constructor.prototype
          if ('onMounted' in componentPrototype) {
            componentPrototype.onMounted.call(componentInstance, containerElement)
          }
        }
      })
      Object.defineProperty(this, 'destroyed', {
        configurable: false,
        enumerable: true,
        value: function () {
        /**
             * @type {any}
             */
          const vueComponent = this
          const componentInstance = vueComponent.$data
          /**
             * @type {any}
             */
          const componentPrototype = componentInstance.constructor.prototype
          if ('onDestroyed' in componentPrototype) {
            componentPrototype.onDestroyed.call(componentInstance)
          }
        }
      })
    }

    getMethods () {
      /**
         * @type {Object.<string, (params: any|undefined) => any>}
         */
      const methods = {}
      const proto = this.#componentDescriptor.componentConstructor.prototype
      this.#componentDescriptor.methods
        .forEach(method => {
          methods[method] = function () {
            const activationObject = ('$data' in this) ? this.$data : this
            return proto[method].apply(activationObject, arguments)
          }
        })
      return methods
    }

    getComputed () {
      /**
         * @type {Object.<string, function|undefined>}
         */
      const computed = {}
      const proto = this.#componentDescriptor.componentConstructor.prototype
      this.#componentDescriptor.computed
        .forEach(method => {
          const descriptor = Object.getOwnPropertyDescriptor(proto, method)
          computed[method] = descriptor ? descriptor.get : undefined
        })
      return computed
    }

    getWatch () {
      /**
         * @type {Object.<string, function>}
         */
      const watch = {}
      const parseValue = this.#parseValue
      this.getProps().forEach(prop => {
        /**
             * @param {any} value
             */
        watch[prop] = function (value) {
          /**
                  * @type {any}
                  */
          const vueComponent = this
          /**
                  * @type {any}
                  */
          const componentInstance = vueComponent.$data
          componentInstance[prop] = parseValue(value)
        }
      })
      return watch
    }

    getTemplate () {
      return this.#componentDescriptor.template
    }

    getData () {
      const ConstructorFunction = this.#componentDescriptor.componentConstructor
      return () => new ConstructorFunction(this.#componentDescriptor.params)
    }

    getProps () {
      return this.#componentDescriptor.properties
    }

    /**
     * Returns a parsed value
     * @param {any} value
     * @returns {any}
     */
    #parseValue = (value) => {
      if ((value == null) || (typeof value !== 'string')) {
        return value
      }
      if (value.toLowerCase() === 'true') {
        return true
      } else if (value.toLowerCase() === 'false') {
        return false
      }
      const numericValue = parseFloat(value)
      if (!isNaN(numericValue)) {
        return numericValue
      }
      return value
    }
}
