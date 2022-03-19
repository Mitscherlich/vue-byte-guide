import { SelectorType } from '../typings/guide'

/**
 * Get the anchor element where the modal should be attached to.
 * @param selector - The CSS selector of the anchor element, or the anchor element itself.
 */
export const getAnchorEl = (selector: SelectorType): Element | null => {
  const type = typeof selector

  if (type === 'string') {
    return document.querySelector(selector as string)
  } if (type === 'function') {
    return (selector as () => Element)()
  }
  return selector as Element | null
}
