<script >
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Card',
  props: {
    id: String,
    right: Boolean,
  },
})
</script>

<template>
  <div :id="id" class="card" :class="[right ? 'card-right' : 'card-left']">
    <slot />
  </div>
</template>

<style>
:root {
  --img-width: 24vw;
  --img-height: var(--img-width);
  --card-width: calc(var(--img-width) - 32px);
  --card-height: calc(var(--img-height) - 32px);
  --content-width: calc(2 * var(--card-width) + 32px);
  --primary: #aaa;
  --default: #ebeded;
}
</style>

<style scoped>
.card {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: var(--card-width);
  min-height: 225px;

  font-family: "Roboto Mono", monospace;
  box-sizing: border-box;
  color: var(--primary);
}

.card-left {
  border-right: solid 1px var(--primary);
  border-bottom: solid 1px var(--primary);
  padding: 32px 32px 32px 0;
}

.card-right {
  border-top: solid 1px var(--primary);
  border-left: solid 1px var(--primary);
  padding: 32px 0 32px 32px;
  margin-left: -1px;
}
</style>
