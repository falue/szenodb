<template>
  <v-tooltip :bottom="!position || position === 'bottom'" :right="position === 'right'" :left="position === 'left'" :top="position === 'top'" color="#303030">
    <template v-slot:activator="{ on, attrs }">
        <v-icon class="hover" :style="opacity ? `opacity: ${opacity} !important;` : `opacity: .25 !important;`" :class="[iconClasses ? iconClasses : 'grey--text ml-2', $vuetify.breakpoint.smAndDown ? 'bigMobileButton pa-2' : '']" small v-bind="attrs" v-on="on"
                @click="$helpers.copyClipBoard(data, $helpers.capitalize(dataName))">mdi-content-copy
        </v-icon>
    </template>
    <span>Copy {{dataName}} to clipboard</span>
  </v-tooltip>
</template>

<script>
  export default {
    name: 'copyComponent',
    props: ['data', 'dataName', 'iconClasses', 'position', 'opacity'],
  }
</script>

<style scoped>
  .hover:hover { opacity: 1 !important;}
</style>