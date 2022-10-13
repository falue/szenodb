<template>
  <v-tooltip :disabled="$vuetify.breakpoint.smAndDown" :bottom="!position || position === 'bottom'" :right="position === 'right'" :left="position === 'left'" :top="position === 'top'">
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        icon
        v-bind="attrs" v-on="on"
        class="grey darken-3"
        :class="buttonClasses"
        :small="$vuetify.breakpoint.mdAndUp"
        :color="buttonColor ? buttonColor : 'primary'"
        @click="share(text)">
        <v-icon class="hover" :style="opacity ? `opacity: ${opacity} !important;` : ``" :class="iconClasses ? iconClasses : ''" :small="$vuetify.breakpoint.mdAndUp" v-bind="attrs" v-on="on"
          >mdi-{{icon ? icon : 'share-variant'}}
        </v-icon>
      </v-btn>
    </template>
    <span>{{tooltip}}</span>
  </v-tooltip>
</template>

<script>
  export default {
    props: ['text', 'icon', 'toastedInfo', 'iconClasses', 'buttonClasses', 'buttonColor', 'tooltip', 'position', 'opacity'],
    data () {
      return {
      }
    },
    methods: {
      async share(text) {
        console.log(text)
        
        if(navigator.share) {
          await navigator.share({text: text}).then(() => {
            this.$toasted.global.info({msg:`Thanks 💯 for sharing!`});
          }).catch(err => {
            console.log(err)
          });
        } else {
          this.$helpers.copyClipBoard(text, this.toastedInfo ? this.toastedInfo : 'Link for sharing in messengers')
        }
      }
    },
  }
</script>

<style scoped>
  .hover:hover { opacity: 1 !important;}
</style>