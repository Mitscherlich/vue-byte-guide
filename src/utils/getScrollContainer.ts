import {
  getComputedStyle,
  getDocumentElement,
  getNodeName,
  getParentNode,
  isHTMLElement,
} from './utils'

export const getScrollContainer = (
  node: Element | HTMLElement,
  callback?: (node: Element | null) => unknown,
): Element => {
  let currentNode = getParentNode(node)

  while (
    isHTMLElement(currentNode as Element)
    && !['html', 'body'].includes(getNodeName(currentNode as Element))
  ) {
    const css = getComputedStyle(currentNode as Element)
    const { overflowY } = css
    const isScrollable = overflowY !== 'visible' && overflowY !== 'hidden'

    callback?.(currentNode as Element)

    if (
      isScrollable
      && (currentNode as Element).scrollHeight
        > (currentNode as Element).clientHeight
    )
      return currentNode as Element

    currentNode = (currentNode as Element).parentNode
  }

  return getDocumentElement(node)
}

// export const getOffsetTopRelativeToScrollContainer = (
//   node: Element | HTMLElement,
// ): Element => {
// }
