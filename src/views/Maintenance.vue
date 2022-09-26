<template>
    <!-- LOGIN FORM -->
    <v-card
      class="mx-auto my-4 mt-12 pa-4"
      :max-width="$vuetify.breakpoint.mdAndUp ? 344 : 6666"
    >
      <v-card-title class="justify-center">Maintenance work</v-card-title>
      <v-card-title class="justify-center mb-6">
        <v-progress-circular size="88" width="7" indeterminate color="primary" class="block"></v-progress-circular> 
      </v-card-title>

      This site is currently being <b>updated</b>, <b>backups</b> are being made or the <b>squirrels</b> got in again.
      <p class="grey--text italics my-4">
        Check back in a few minutes
        <v-icon small color="pink">mdi-heart</v-icon>
      </p>
    </v-card>

</template>

<script>
  export default {
    name: 'Maintenance',
    props: {
      settings: Object,
    },
    
    data () {
      return {
      }
    },
    watch: {
      async settings() {
        // Catch if maintenance was cleared - route to resources because why not
        if(this.settings.maintenance === false) {
          this.$router.push("/resources");
        }
      },
    },

    methods: {
    }

  }
</script>

