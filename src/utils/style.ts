const objProto = Object.prototype
const hasOwnProperty = objProto.hasOwnProperty

export function normalizeStyleBinding(raw: Record<string, any>) {
  return Object.keys(raw).reduce((style, key) => {
    if (hasOwnProperty.call(raw, key)) {
      if (typeof raw[key] === 'number') {
        style[key] = `${raw[key]}px`
      } else {
        style[key] = raw[key]
      }
    }
    return style
  }, {} as Record<string, string>)
}
