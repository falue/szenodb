<template>
  <v-tooltip :disabled="$vuetify.breakpoint.smAndDown" :bottom="!position" :right="position === 'right'" :left="position === 'left'" :top="position === 'top'" color="#212121">
    <template v-slot:activator="{ on, attrs }">
        <v-icon class="hover" :style="opacity ? `opacity: ${opacity} !important;` : `opacity: .25 !important;`" :class="[iconClasses ? iconClasses : 'grey--text ml-2', $vuetify.breakpoint.smAndDown ? 'bigMobileButton' : '']" :small="$vuetify.breakpoint.mdAndUp" v-bind="attrs" v-on="on"
                @click="$helpers.copyClipBoard(data, $helpers.capitalize(dataName))">mdi-content-copy
        </v-icon>
    </template>
    <span>Copy {{dataName}} to clipboard</span>
  </v-tooltip>
</template>

<script>
  export default {
    props: ['data', 'dataName', 'iconClasses', 'position', 'opacity'],
  }
</script>

<style scoped>
  .hover:hover { opacity: 1 !important;}
  .bigMobileButton { transform: translateY(-.25em); padding: .25em .5em; line-height: 1em; }
</style>