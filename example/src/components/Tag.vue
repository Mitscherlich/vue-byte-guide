<script setup>
defineProps({
  id: String,
  color: String,
})
</script>

<template>
  <div :id="id" class="tag" :style="{ color, borderColor: color }">
    <slot />
  </div>
</template>

<style scoped>
.tag {
  display: inline-block;
  padding: 0px 8px;
  border: solid 1px #ccc;
  border-radius: 2px;
  background: #fafafa;
  font-size: 12px;
}
</style>
