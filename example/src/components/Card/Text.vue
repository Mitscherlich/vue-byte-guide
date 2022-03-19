<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'CardText',
  props: {
    id: String,
  },
})
</script>

<template>
  <p :id="id" class="card-text">
    <slot />
  </p>
</template>

<style scoped>
.card-text {
  width: var(--card-width);
  text-align: left;
  margin-top: 32px;
  font-size: 1rem;
  font-weight: lighter;
  text-overflow: ellipsis;
  max-width: calc(var(--card-width) - 32px);
  overflow: hidden;
  white-space: nowrap;
}
</style>
