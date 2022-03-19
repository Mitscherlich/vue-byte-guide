<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'CardTitle',
  props: {
    id: String,
  },
})
</script>

<template>
  <h3 :id="id" class="card-title">
    <slot />
  </h3>
</template>

<style scoped>
.card-title {
  margin-top: 24px;
  font-size: 16px;
  max-width: var(--img-width);
  overflow: hidden;
}

.card-title > div {
  white-space: nowrap;
}
</style>
