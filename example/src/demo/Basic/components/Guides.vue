<script >
import Guide from 'vue-byte-guide'
import { defineComponent } from 'vue'
import { STEPS } from '../const'

export default defineComponent({
  name: 'Guides',
  components: { Guide },
  props: {
    maskedGuideVisible: Boolean,
    guideVisible: Boolean,
    previousGuideVisible: Boolean,
    step: Number,
  },
  setup: () => ({ STEPS }),
})
</script>

<template>
  <Guide :steps="STEPS" mask :visible="maskedGuideVisible" lang="en" />
  <Guide :steps="STEPS" :visible="previousGuideVisible" show-previous-btn lang="en" />
  <Guide :steps="STEPS" :mask="false" hotspot lang="en" :visible="guideVisible" />
  <Guide
    :steps="STEPS"
    :mask="false"
    :step="step"
    modal-class-name="guide-hidden-footer"
    lang="en"
  />
</template>

<style scoped>
.guide-hidden-footer >>> .guide-modal-footer {
  display: none;
}
</style>
