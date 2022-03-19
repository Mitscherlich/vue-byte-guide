import PropTypes from 'vue-types'
import {
  defineComponent, toRefs, ref, computed, Teleport,
} from 'vue'

import { CloseSmall } from './Icons'
import {
  getArrowStyle,
  getHotSpotStyle,
  getModalStyle,
  getScrollContainer,
  getDocumentElement,
  getNodeName,
} from '../../utils'
import { useEffect, useNormalizedStyle } from '../../composable'
import { MARGIN } from '../../constants/const'
import { IModal } from '../../typings/guide'
import './Modal.less'

const PREFIX = 'guide-modal'

export const Modal = defineComponent<IModal & { visible?: boolean }>((props, ctx) => {
  const {
    steps,
    stepText,
    nextText,
    okText,
    TEXT,
    prevText,
  } = props
  const {
    visible = ref(true),
    mask,
    arrow,
    hotspot,
    closable,
    realWindow,
    anchorEl,
    parentEl,
    stepIndex,
    showPreviousBtn,
  } = toRefs(props)

  const stepInfo = computed(() => steps[stepIndex.value])

  const modalRef = ref<HTMLDivElement>()
  const timerRef = ref<number>(0)

  /* The ref to the currently focused element */
  const focusedElRef = ref<HTMLElement | null>(null)

  /* the index of the focused element in the NodeList `focusableEls` */
  const focusedIdxRef = ref<number>(0)

  const modalStyleRef = ref({})
  const arrowStyleRef = ref({})
  const hotspotStyleRef = ref({})

  const normalizedModalStyle = useNormalizedStyle(modalStyleRef)
  const normalizedArrowStyle = useNormalizedStyle(arrowStyleRef)
  const normalizedHotspotStyle = useNormalizedStyle(hotspotStyleRef)

  const scrollContainer = computed(() => getScrollContainer(anchorEl.value))

  const _okText = stepIndex.value !== steps.length - 1
    ? nextText || TEXT('NEXT_STEP')
    : okText || TEXT('I_KNOW')
  const _prevText = prevText || TEXT('PREV_STEP')
  const _stepText = stepText || (TEXT('STEP_NUMBER') as (idx: number, len: number) => string)

  const calculateStyle = (): void => {
    const { placement, offset } = stepInfo.value

    const modalEl = modalRef.value

    if (!modalEl) return

    const modalStyle = getModalStyle(
      modalEl,
      anchorEl.value,
      parentEl.value,
      scrollContainer.value,
      placement,
      offset,
    )
    const arrowStyle = getArrowStyle(modalEl, placement, mask.value)
    const hotspotStyle = getHotSpotStyle(
      placement,
      arrowStyle as Record<string, number>,
    )

    modalStyleRef.value = modalStyle
    arrowStyleRef.value = arrowStyle
    hotspotStyleRef.value = hotspotStyle
  }

  const handleNextChange = (): void => {
    stepInfo.value.beforeStepChange?.(stepInfo.value, stepIndex.value, steps)
    ctx.emit('change', 1)
  }

  const handlePreviousChange = (): void => {
    stepInfo.value.beforeStepChange?.(stepInfo.value, stepIndex.value, steps)
    ctx.emit('change', -1)
  }

  const handleScroll = (): void => {
    const modalEl = modalRef.value

    if (!modalEl) return

    const anchorPos = anchorEl.value.getBoundingClientRect()
    const modalPos = (modalEl as Element).getBoundingClientRect()
    const scrollPos = scrollContainer.value.getBoundingClientRect()

    const isScrollContainerHtml = getNodeName(scrollContainer.value) === 'html'

    /* scroll the scroll container to show the modal */
    const visibleHeight = (scrollContainer.value as HTMLElement).clientHeight
    const scrollContainerTop = isScrollContainerHtml ? 0 : scrollPos.top
    if (
      // Modal is below the viewport
      anchorPos.top
      - scrollContainerTop
      + anchorPos.height
      + modalPos.height
      + MARGIN
      >= visibleHeight
      // Modal is above the viewport
      || anchorPos.top <= modalPos.height + MARGIN
    ) {
      // scrolls to a particular set of coordinates inside a given element.
      scrollContainer.value.scrollTo({
        left: 0,
        top:
          scrollContainer.value.scrollTop
          + anchorPos.top
          - scrollContainerTop
          + anchorPos.height / 2
          - visibleHeight / 2
          + MARGIN,
        behavior: 'smooth',
      })
    }

    if (getNodeName(scrollContainer.value) === 'html') {
      return
    }

    const documentEl = getDocumentElement(anchorEl.value)
    /* scroll to show the scroll container */
    if (
      // Modal is below the viewport
      scrollPos.top + scrollPos.height >= realWindow.value.innerHeight
      // Modal is above the viewport
      || scrollPos.bottom > scrollPos.height
    ) {
      // scrolls to a particular set of coordinates inside a given element.
      documentEl.scrollTo({
        left: 0,
        top:
          documentEl.scrollTop
          + scrollPos.top
          + scrollPos.height / 2
          - realWindow.value.innerHeight / 2
          + MARGIN,
        behavior: 'smooth',
      })
    }
  }

  const handleResize = (): void => {
    if (timerRef.value) {
      realWindow.value.cancelAnimationFrame(timerRef.value)
    }
    timerRef.value = realWindow.value.requestAnimationFrame(() => {
      calculateStyle()
    })
  }

  const handleKeydown = (e: KeyboardEvent | { keyCode: number }): void => {
    const focusableEls: NodeListOf<HTMLElement> | null = modalRef.value?.querySelectorAll(
      '.guide-modal-title, .guide-modal-content, .guide-modal-footer-text, .guide-modal-footer-btn',
    ) || null

    if (e.keyCode !== 9 || !focusableEls) {
      return
    }

    (e as KeyboardEvent)?.preventDefault?.()

    const idx = focusedIdxRef.value
    const len = focusableEls.length
    const ele = focusableEls[idx]

    focusedElRef.value?.blur()
    ele.focus()
    focusedElRef.value = ele

    if (idx === len - 1 && !(e as KeyboardEvent).shiftKey) {
      focusedIdxRef.value = 0
    } else if (idx === 0 && (e as KeyboardEvent).shiftKey) {
      focusedIdxRef.value = len - 1
    } else if ((e as KeyboardEvent).shiftKey) {
      focusedIdxRef.value -= 1
    } else {
      focusedIdxRef.value += 1
    }
  }

  useEffect(() => {
    if (stepInfo.value.skip) {
      ctx.emit('change', 1)
    } else if (visible.value) {
      focusedIdxRef.value = 0

      handleScroll()
      handleKeydown({ keyCode: 9 })
      calculateStyle()

      realWindow.value.addEventListener('resize', handleResize)
      realWindow.value.addEventListener('keydown', handleKeydown)
    }

    return () => {
      realWindow.value.removeEventListener('resize', handleResize)
      realWindow.value.removeEventListener('keydown', handleKeydown)
    }
  }, [visible, stepInfo, anchorEl])

  return () => (visible.value ? (
    <Teleport to={parentEl.value}>
      <div ref={modalRef} class={PREFIX} style={normalizedModalStyle.value}>
        {/* ARROW */}
        {arrow.value && <span class={`${PREFIX}-arrow`} style={normalizedArrowStyle.value} />}
        {/* HOT SPOT */}
        {hotspot.value && <div class={`${PREFIX}-hotspot`} style={normalizedHotspotStyle.value} />}
        {/* CLOSE BUTTON */}
        {ctx.slots.close ? (
          <div class={`${PREFIX}-close-icon`} onClick={() => ctx.emit('close')}>{ctx.slots.close}</div>
        ) : closable.value ? (
          <CloseSmall class={`${PREFIX}-close-icon`} />
        ) : null}
        {/* MODAL TITLE */}
        <div class={`${PREFIX}-title`}>{stepInfo.value.title}</div>
        {/* MODAL CONTENT */}
        <div class={`${PREFIX}-content`}>
          {typeof stepInfo.value.content === 'function'
            ? stepInfo.value.content()
            : stepInfo.value.content}
        </div>
        {/* MODAL FOOTER */}
        <div class={`${PREFIX}-footer`}>
          <span class={`${PREFIX}-footer-text`}>
            {_stepText(stepIndex.value + 1, steps.length)}
          </span>
          <div class={`${PREFIX}-footer-btn-group`}>
            {showPreviousBtn.value && stepIndex.value !== 0 && (
              <button
                class={`${PREFIX}-footer-btn ${PREFIX}-footer-prev-btn`}
                onClick={handlePreviousChange}
              >
                {_prevText}
              </button>
            )}
            <button
              class={`${PREFIX}-footer-btn ${PREFIX}-footer-next-btn`}
              onClick={handleNextChange}
            >
              {_okText}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  ) : null)
})

Modal.name = 'ByteGuideModal'
Modal.props = {
  anchorEl: PropTypes.any,
  parentEl: PropTypes.any,
  realWindow: PropTypes.any,
  steps: PropTypes.array,
  stepIndex: PropTypes.number,
  mask: PropTypes.bool.def(undefined), // loose bool
  arrow: PropTypes.bool.def(undefined), // loose bool
  hotspot: PropTypes.bool.def(undefined), // loose bool
  closable: PropTypes.bool.def(undefined), // loose bool
  stepText: PropTypes.func,
  showPreviousBtn: PropTypes.bool.def(undefined), // loose bool
  nextText: PropTypes.string,
  prevText: PropTypes.string,
  okText: PropTypes.string,
  TEXT: PropTypes.func,
}
Modal.emits = ['change', 'close'] as const
Modal.inheritAttrs = false
