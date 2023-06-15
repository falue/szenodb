<template>
    <v-card
      :class="$vuetify.breakpoint.xs ? 'transparent fill-height ma-0 pa-4' : 'mx-auto my-4 mt-12 pa-8'"
      :max-width="$vuetify.breakpoint.smAndUp ? 344 : 6666"
      max-height="80%"
      :flat="$vuetify.breakpoint.smAndUp"
      style="overflow-y: auto;"
    >
      <v-card-title class="justify-center">Privacy & Terms Update</v-card-title>
      <v-card-text class="white--text italics text-center">
        Please consent again
      </v-card-text>
      <!-- <pre>{{consentForm}}</pre> -->
      <form @submit.prevent>
            <v-checkbox dense hide-details class="ma-0" v-model="checkbox.privacy">
              <template v-slot:label>
                  I agree to the <router-link class="ml-1" to="/privacy" @click.stop>Privacy Agreement</router-link>
              </template>
            </v-checkbox>
            
            <v-checkbox dense hide-details class="ma-0" v-model="checkbox.terms">
              <template v-slot:label>
                  I agree to the <router-link class="ml-1" to="/terms" @click.stop>Terms & conditions</router-link>
              </template>
            </v-checkbox>

          <v-card-actions class="px-0 mt-4">
            <v-spacer></v-spacer>
            <v-btn type="submit" :disabled="!(checkbox.privacy && checkbox.terms)" color="primary" @click="confirm()">Confirm</v-btn>
          </v-card-actions>
      </form>
    </v-card>
</template>

<script>
/* eslint-disable */
  export default {
    name: 'ConsentView',
  props: {
    user: Object,
    settings: Object,
  },
    
    data () {
      return {
        consentForm: {
          privacy: null,
          terms: null,
        },
        checkbox: {
          privacy: false,
          terms: false,
        },
      }
    },

    created() {
      this.checkbox.privacy = this.user.consent && this.user.consent.privacy.seconds > this.settings.consent.privacy.seconds;
      this.checkbox.terms = this.user.consent && this.user.consent.terms.seconds > this.settings.consent.terms.seconds;
    },
    watch: {
      checkbox: {
        handler() {
          this.consentForm.privacy = this.checkbox.privacy ? this.consentForm.privacy ? this.consentForm.privacy : new Date() : null;
          this.consentForm.terms = this.checkbox.terms ? this.consentForm.terms ? this.consentForm.terms : new Date() : null;
        },
        deep: true
      }
    },

    methods: {
      confirm() {
        // updateField({commit}, {collection, document, field, data}) {
        this.$store.dispatch('updateField', {
          "collection": "users", "document": this.user.uid, "field": "consent", "data": this.consentForm
        }).then(async () => {
          console.log('Successful confirm.')
          // update local user
          this.user.consent = this.consentForm;
          this.$store.commit('setUserProfile', this.user)
          await this.$helpers.sleep(500);
          console.log('Successful set local user.');
          console.log("go to", this.$route.query.next);
          this.$router.push(this.$route.query.next);
        }).catch(error => {
          console.log(error);
          console.error(error.message);
          this.$toasted.global.error({msg:error.message});
        });
      }
    },

  }
</script>

