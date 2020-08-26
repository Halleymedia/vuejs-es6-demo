import { componentRegistry } from 'services/ComponentRegistry'
import { router } from 'services/Router'

/**
 * @param {string} elementName
 * @param {string} template
 * @param {string|undefined} [route]
 * @param {string|undefined} [title]
 * @return {(target: any) => any}
 */
export const Component = (elementName, template, route = undefined, title = undefined) =>
  (target) => {
    componentRegistry.registerComponent(elementName, target, target)
    const ignoreMembers = ['constructor', 'onMounted', 'onDestroyed']

    /**
             * @type {Array<string>}
             */
    const propertyNames = []

    const memberNames = Object.getOwnPropertyNames(target.prototype).filter(name => ignoreMembers.indexOf(name) < 0)

    /**
             * @type {Array<string>}
             */
    const methodNames = []

    /**
             * @type {Array<string>}
             */
    const computedNames = []

    memberNames.forEach(memberName => {
      const descriptor = Object.getOwnPropertyDescriptor(target.prototype, memberName)
      if (!descriptor) {
        return
      }
      if (('set' in descriptor) && descriptor.set) {
        propertyNames.push(memberName)
      } else if ('get' in descriptor) {
        computedNames.push(memberName)
      } else {
        methodNames.push(memberName)
      }
    })

    componentRegistry.registerComponentMethods(target, methodNames)
    componentRegistry.registerComponentProperties(target, propertyNames)
    componentRegistry.registerComponentComputed(target, computedNames)
    componentRegistry.registerComponentTemplate(target, template)

    if (route) {
      router.addRoute(elementName, route, title)
    }
  }
