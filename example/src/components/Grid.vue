<script>
import PropTypes from 'vue-types'
import toArray from 'lodash/castArray'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Grid',
  props: {
    container: PropTypes.bool.def(undefined), // loose bool
    item: PropTypes.bool.def(undefined), // loose bool
    direction: PropTypes.oneOf(['row', 'column']),
    edge: PropTypes.oneOf(['edge', 'end']),
  },
  setup(_, ctx) {
    const { default: children } = ctx.slots
    const count = toArray(children).length

    return { count }
  },
})
</script>

<template>
  <div v-if="item" class="grid-item" :class="[edge ? 'end' : 'end-item']">
    <slot />
  </div>
  <div
    v-else-if="container"
    class="grid"
    :style="{
      gridTemplateColumns: direction === 'row' ? `repeat(${count}, auto)` : 'initial',
      gridTemplateRows: direction === 'column' ? `repeat(${count}, auto)` : 'initial',
    }"
  >
    <slot />
  </div>
</template>

<style scoped>
.grid {
  display: grid;
}

.grid-item.end-item {
  justify-self: end;
}
</style>
