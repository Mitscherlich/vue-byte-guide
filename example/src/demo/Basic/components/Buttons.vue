<script setup>
  import Button from '~/components/Button.vue'

  defineEmits(['mask-guide:open', 'guide:open', 'previous-mode-guide:open', 'add-step'])
</script>

<template>
  <Button
    class="demo-main-btn demo-mask"
    @click="$emit('mask-guide:open')"
  >
    masked mode
  </Button>
  <Button
    class="demo-main-btn demo-nomask"
    @click="$emit('guide:open')"
  >
    unmasked mode
  </Button>
  <Button
    class="demo-main-btn demo-show-previous"
    @click="$emit('previous-mode-guide:open')"
  >
    show Previous Btn
  </Button>
  <Button
    class="demo-main-btn add-step"
    @click="$emit('add-step')"
  >
    controlled mode: click me to go to next step
  </Button>
</template>

<style scoped>
.demo-main-btn {
  position: fixed;
  left: 64px;
}

.demo-main-btn.demo-mask {
  top: 104px;
}

.demo-main-btn.demo-nomask {
  top: 160px;
}

.demo-main-btn.demo-show-previous {
  top: 276px;
}

.demo-main-btn.add-step {
  top: 216px;
}
</style>
