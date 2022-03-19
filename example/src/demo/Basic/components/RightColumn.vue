<script setup>
import { computed } from 'vue'
import { Card, Grid } from '~/components'
import { ITEMS } from '../const'

const { Title, Media, Text } = Card

const count = ITEMS.length
const items = computed(() => ITEMS.slice(Math.ceil(count / 2)))
</script>

<template>
  <Grid container direction="column">
    <Grid v-for="{ title, media, text } in items" :key="title" item>
      <Card right>
        <Title :id="`${title}-title`">{{ title }}</Title>
        <Media :id="`${title}-media`" :src="media" />
        <Text :id="`${title}-text`">{{ text }}</Text>
      </Card>
    </Grid>
    <Grid item>
      <Card id="gallery-footer" right>
        <Title>SUBLIME AND PEACEFUL</Title>
        <Text>
          Vivamus sollicitudin mauris quis ipsum pharetra, id iaculis diam
          vulputate.
        </Text>
      </Card>
    </Grid>
  </Grid>
</template>
