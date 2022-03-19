<script setup>
import { ref } from 'vue'
import { Grid } from '~/components'
import LeftColumn from './components/LeftColumn.vue'
import RightColumn from './components/RightColumn.vue'
import Guides from './components/Guides.vue'
import Buttons from './components/Buttons.vue'

const step = ref(-1)
const guideVisible = ref(false)
const maskedGuideVisible = ref(false)
const previousGuideVisible = ref(false)

const handleMaskedGuideOpen = () => {
  maskedGuideVisible.value = true
  guideVisible.value = false
  previousGuideVisible.value = false
}

const handleGuideOpen = () => {
  maskedGuideVisible.value = false
  guideVisible.value = true
  previousGuideVisible.value = false
  step.value = -1
}

const handlePreviousModeGuideOpen = () => {
  maskedGuideVisible.value = false
  guideVisible.value = true
  previousGuideVisible.value = false
  step.value = -1
}
</script>

<template>
  <Guides
    :guide-visible="guideVisible"
    :masked-guide-visible="maskedGuideVisible"
    :previous-guide-visible="previousGuideVisible"
    :step="step"
  />
  <h2 class="demo-main-header">Start the tour</h2>
  <Buttons
    @mask-guide:open="handleMaskedGuideOpen"
    @guide:open="handleGuideOpen"
    @previous-mode-guide:open="handlePreviousModeGuideOpen"
    @add-step="() => {
      step += 1
      maskedGuideVisible = false
      guideVisible = false
    }"
  />
  <Grid container class="demo-nomask-container">
    <Grid item>
      <LeftColumn />
    </Grid>
    <Grid item>
      <RightColumn />
    </Grid>
  </Grid>
</template>

<style scoped>
.demo-nomask-container {
  display: flex;
  padding-top: 64px;
  align-items: center;
  justify-content: center;
}

.demo-main-header {
  position: fixed;
  left: 64px;
}

.demo-main-header {
  top: 40px;
}
</style>
