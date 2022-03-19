<script setup>
import { computed } from 'vue'
import { Card, Grid } from '~/components'
import { ITEMS } from '../const'

const { Title, Media, Text } = Card

const count = ITEMS.length
const items = computed(() => ITEMS.slice(0, Math.ceil(count / 2)))
</script>

<template>
  <Grid container direction="column">
    <Grid item>
      <Card>
        <Title id="gallery-title">NATURE</Title>
        <Text>
          Vivamus sollicitudin mauris quis ipsum pharetra, id iaculis diam
          vulputate.
        </Text>
      </Card>
    </Grid>
    <Grid v-for="({ title, media, text }) in items" :key="title" item>
      <Card>
        <Title :id="`${title}-title`">{{ title }}</Title>
        <Media :id="`${title}-media`" :src="media" />
        <Text :id="`${title}-text`">{{ text }}</Text>
      </Card>
    </Grid>
  </Grid>
</template>
