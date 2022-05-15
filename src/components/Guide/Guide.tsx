import PropTypes from 'vue-types'
import {
  computed, defineComponent, ref, toRefs,
} from 'vue'
import { useEffect } from '@m9ch/vhooks'

import {
  getAnchorEl,
  getCusAnchorEl,
  getDocument,
  getDocumentElement,
  getOffsetParent,
  getWindow,
} from '../../utils'
import { i18n } from '../../constants/lang'
import { Mask } from '../Mask'
import { Modal } from '../Modal'
import type { IGuide } from '../../typings/guide'
import { CUSTOM_ELEMENT_CLASS } from '../../constants/className'

export const Guide = defineComponent<IGuide>((props, ctx) => {
  const {
    steps,
    localKey,
    beforeStepChange,
    afterStepChange,
    stepText,
    prevText,
    nextText,
    okText,
  } = props
  const { class: className } = ctx.attrs
  const {
    visible = ref(true),
    mask = ref(true),
    arrow = ref(true),
    hotspot = ref(true),
    closable = ref(true),
    modalClassName = ref(''),
    maskClassName = ref(''),
    expireDate = ref(''),
    step = ref(0),
    lang = ref<'zh' | 'en' | 'ja'>('zh'),
    showPreviousBtn = ref(true),
  } = toRefs(props)

  const stepIndex = ref<number>(-1)

  /* store the initial overflow value of the document */
  const initOverflowVal = ref<string>('')

  /* used to trigger a calculation of anchorEl */
  const ticker = ref<number>(0)

  const i18nTEXT = computed(() => i18n(lang.value))

  const anchorEl = computed(() => {
    if (stepIndex.value >= 0 && stepIndex.value < steps.length) {
      const { targetPos, selector } = steps[stepIndex.value]

      if (selector) return getAnchorEl(selector)

      if (targetPos) return getCusAnchorEl(targetPos)
    }
    return null
  })

  const parentEl = computed(() => (anchorEl.value
    ? steps[stepIndex.value].parent === 'body' || mask.value
      ? getDocument(anchorEl.value).body
      : getOffsetParent(anchorEl.value)
    : null))

  /* To cater the cases of using iframe where the anchorEl
   * is not in the same window scope as the code running
   */
  const realWindow = computed(() => (anchorEl.value ? getWindow(anchorEl.value) : null))

  const realDocument = computed(() => (anchorEl.value ? getDocumentElement(anchorEl.value) : null))

  const handleClose = (): void => {
    /* If the mask is displayed, the document's overflow value would have been set to `hidden`.
     * It should be recovered to its initial value as saved by initOverflowVal
     */
    if (mask.value)
      (realDocument.value as HTMLElement).style.overflow = initOverflowVal.value

    const cusAnchor = document.querySelector(CUSTOM_ELEMENT_CLASS)
    if (cusAnchor)
      document.body.removeChild(cusAnchor)

    stepIndex.value = -1

    ctx.emit('close')
    if (localKey) localStorage.setItem(localKey, 'true')
  }

  const handleChange = (direction: number): void => {
    const nextStepIndex = Math.min(Math.max(stepIndex.value + direction, 0), steps.length)
    if (nextStepIndex === stepIndex.value) return
    if (nextStepIndex === steps.length) handleClose()
    else if (stepIndex.value >= 0) beforeStepChange?.(stepIndex.value, steps[stepIndex.value])
    stepIndex.value = nextStepIndex
  }

  // skip the guide when click the escape key;
  const handleKeydown = (e: KeyboardEvent): void => {
    if (e.key === 'Escape' && (closable || stepIndex.value === steps.length - 1))
      handleClose()
  }

  useEffect(() => {
    if (visible.value) {
      const haveShownGuide = localKey ? localStorage.getItem(localKey) : false
      const expireDateParse = new Date(
        Date.parse(expireDate.value!.replace(/-/g, '/')),
      )
      if (!haveShownGuide && (!expireDate.value || new Date() <= expireDateParse))
        stepIndex.value = step.value!
    }
    else {
      stepIndex.value = -1
    }
  }, [visible, step])

  useEffect(() => {
    if (realWindow.value && realDocument.value) {
      realWindow.value.addEventListener('keydown', handleKeydown as EventListener)

      return () => {
        realWindow.value?.removeEventListener('keydown', handleKeydown as EventListener)
      }
    }
  }, [realWindow, realDocument])

  useEffect(() => {
    if (stepIndex.value >= 0)
      afterStepChange?.(stepIndex.value, steps[stepIndex.value])
  }, [stepIndex])

  useEffect(() => {
    if (mask.value && realDocument.value) {
      const curOverflow = realDocument.value.style.overflow
      initOverflowVal.value = curOverflow || 'scroll'
    }
  }, [mask, realDocument])

  useEffect(() => {
    if (stepIndex.value >= 0) {
      const config = {
        childList: true,
        subtree: true,
      }
      const observer = new MutationObserver(() => {
        ticker.value += 1
      })

      observer.observe(document, config)

      return () => {
        observer.disconnect()
      }
    }
  }, [stepIndex, ticker])

  return () => ((!mask.value || initOverflowVal.value) && parentEl.value ? (
    <>
      {mask.value && (
        <Mask class={[maskClassName, className].filter(Boolean)} anchorEl={anchorEl.value as Element} realWindow={realWindow.value as Window} />
      )}
      <Modal
        class={[modalClassName.value, className].filter(Boolean)}
        anchorEl={anchorEl.value as HTMLElement}
        parentEl={parentEl.value as HTMLElement}
        realWindow={realWindow.value as Window}
        steps={steps}
        stepIndex={stepIndex.value}
        mask={mask.value!}
        arrow={arrow.value!}
        hotspot={hotspot.value!}
        closable={closable.value!}
        stepText={stepText}
        prevText={prevText}
        nextText={nextText}
        okText={okText}
        TEXT={i18nTEXT.value}
        showPreviousBtn={showPreviousBtn.value!}
        // @ts-ignore
        onClose={handleClose}
        onChange={handleChange}
      />
    </>
  ) : null)
})

Guide.name = 'ByteGuide'
Guide.props = {
  steps: PropTypes.array,
  localKey: PropTypes.string,
  mask: PropTypes.bool.def(true),
  arrow: PropTypes.bool.def(true),
  hotspot: PropTypes.bool.def(true),
  closable: PropTypes.bool.def(true),
  step: PropTypes.number.def(0),
  modalClassName: PropTypes.string.def(''),
  maskClassName: PropTypes.string.def(''),
  expireDate: PropTypes.string.def(''),
  visible: PropTypes.bool.def(true),
  lang: PropTypes.oneOf(['zh', 'en', 'ja']).def('zh'),
  stepText: PropTypes.func,
  prevText: PropTypes.string,
  nextText: PropTypes.string,
  okText: PropTypes.string,
  beforeStepChange: PropTypes.func,
  afterStepChange: PropTypes.func,
  showPreviousBtn: PropTypes.bool.def(true),
}
Guide.emits = ['close'] as const
Guide.inheritAttrs = false
