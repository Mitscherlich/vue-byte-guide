<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'CardMedia',
  props: {
    id: String,
    src: {
      type: String,
      required: true,
    },
  },
})
</script>

<template>
  <div :id="id" class="card-media">
    <img :src="src" />
  </div>
</template>

<style scoped>
.card-media {
  position: relative;
  width: 100%;
  height: var(--card-height);
  overflow: hidden;
}

.card-media > img {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: var(--img-width);
}
</style>
