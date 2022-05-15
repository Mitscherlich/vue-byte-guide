import PropTypes from 'vue-types'
import {
  Teleport, defineComponent, ref, toRefs,
} from 'vue'
import { useEffect } from '@m9ch/vhooks'
import { getDocument, getMaskStyle } from '../../utils'
import './Mask.css'

export interface MaskProps {
  anchorEl: Element
  realWindow: Window
}

export const Mask = defineComponent<MaskProps>((props, ctx) => {
  const { class: className } = ctx.attrs
  const { anchorEl, realWindow } = toRefs(props)

  const styleRef = ref<Record<string, number>>({})
  const timerRef = ref<number>(0)

  const calculateStyle = (): void => {
    const style = getMaskStyle(anchorEl.value)
    styleRef.value = style
  }

  const handleResize = (): void => {
    if (timerRef.value)
      realWindow.value.cancelAnimationFrame(timerRef.value)

    timerRef.value = realWindow.value.requestAnimationFrame(() => {
      calculateStyle()
    })
  }

  useEffect(() => {
    calculateStyle()
  }, [anchorEl])

  useEffect(() => {
    realWindow.value.addEventListener('resize', handleResize)

    return () => {
      realWindow.value.removeEventListener('resize', handleResize)
    }
  }, [realWindow, anchorEl])

  return () => {
    if (!anchorEl.value)
      return null

    return (
      <Teleport to={getDocument(anchorEl.value).body}>
        <div class={['guide-mask', className]} style={styleRef.value} />
      </Teleport>
    )
  }
})

Mask.name = 'ByteGuideMask'
Mask.props = {
  anchorEl: PropTypes.any,
  realWindow: PropTypes.any,
}
Mask.inheritAttrs = false
