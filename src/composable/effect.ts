import { watch, onMounted, onBeforeUnmount, Ref } from 'vue'

const noop = () => {
  /* noop */
}

export type EffectFn = () => Destroyer | void
export type Destroyer = () => void

export const useEffect = (fn: EffectFn, deps: Ref<any>[] = []) => {
  let cb: typeof noop

  const stopWatch = watch(deps, () => {
    const response = fn()
    if (typeof response === 'function') {
      cb = response
    }
  })

  const stop = () => {
    stopWatch()
    cb?.()
  }

  onMounted(fn)

  onBeforeUnmount(stop)
}
