import { computed, Ref } from 'vue'

import { normalizeStyleBinding } from '../utils'

export const useNormalizedStyle = (styleRef: Ref<Record<string, any>>) => computed(() => normalizeStyleBinding(styleRef.value))
