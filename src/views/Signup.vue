<template>
    <!-- SIGNUP FORM -->
    <v-card
      :class="$vuetify.breakpoint.smAndDown ? 'transparent fill-height ma-0 pa-4' : 'mx-auto my-4 mt-12 pa-8 pt-4'"
      :max-width="$vuetify.breakpoint.mdAndUp ? 344 : 6666"
      max-height="80%"
      :flat="$vuetify.breakpoint.smAndDown"
      style="overflow-y: auto;"
    >
      <v-card-title class="justify-center">Sign up <span class="pink--text ml-1">(always free)</span></v-card-title>
      <form @submit.prevent>
          <v-text-field filled v-model.trim="signupForm.name" type="text" placeholder="Name*" id="name"></v-text-field>
          <v-text-field filled v-model.trim="signupForm.title" type="text" placeholder="Profession" id="title"></v-text-field>
          <v-text-field filled v-model.trim="signupForm.email" type="text" placeholder="Email*" id="email2"></v-text-field>
          <v-text-field filled v-model.trim="signupForm.password" type="password" placeholder="Password*" hint="min 6 characters" id="password2"></v-text-field>
            <!-- <v-checkbox v-model="consent.privacy" :label="`Checkbox 1: ${consent.privacy.toString()}`"></v-checkbox> -->

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
            <v-btn to="/login">Back</v-btn>
            <v-spacer></v-spacer>
            <v-btn type="submit" :disabled="!(checkbox.privacy && checkbox.terms && signupForm.email.length && signupForm.name.length && signupForm.password.length >= 6)" color="primary" @click="signup()">Sign Up</v-btn>
          </v-card-actions>
      </form>
    </v-card>
</template>

<script>
  export default {
    name: 'SignUp',
    
    data () {
      return {
        signupForm: {
          name: '',
          title: '',
          email: '',
          password: '',
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
      this.signupForm.email = this.$route.query.email;
    },

    watch: {
      checkbox: {
        handler() {
          this.signupForm.privacy = this.checkbox.privacy ? this.signupForm.privacy ? this.signupForm.privacy : new Date() : null;
          this.signupForm.terms = this.checkbox.terms ? this.signupForm.terms ? this.signupForm.terms : new Date() : null;
        },
        deep: true
      }
    },

    methods: {
      signup() {
        //console.log(this.signupForm);
        this.$store.dispatch('signup', this.signupForm).then(() => {
          console.log('Successful signup.')
        }).catch(error => {
          console.log(error);
          console.error(error.message);
          this.$toasted.global.error({msg:error.message});
        });
      }
    },

  }
</script>

