<template>
  <v-tooltip :disabled="$vuetify.breakpoint.smAndDown" :bottom="!position" :right="position === 'right'" :left="position === 'left'" :top="position === 'top'" color="#212121">
    <template v-slot:activator="{ on, attrs }">
        <v-icon class="hover" :style="opacity ? `opacity: ${opacity} !important;` : `opacity: .25 !important;`" :class="[iconClasses ? iconClasses : 'grey--text ml-2', $vuetify.breakpoint.smAndDown ? 'bigMobileButton' : '']" :small="$vuetify.breakpoint.mdAndUp" v-bind="attrs" v-on="on">
          mdi-{{icon ? icon : 'information'}}
        </v-icon>
    </template>
    <div style="max-width:275px">
      <b>{{title}}</b>
      <br v-if="title">
      <span v-html="text" :class="title ? 'grey--text' : ''"></span>
    </div>
  </v-tooltip>
</template>

<script>
  export default {
    props: ['title', 'text', 'icon', 'iconClasses', 'position', 'opacity'],
  }
</script>

<style scoped>
  .hover:hover { opacity: 1 !important;}
</style>