<template>
    <!-- SIGNUP FORM -->
    <v-card
      class="mx-auto my-4 mt-12 pa-4"
      :max-width="$vuetify.breakpoint.mdAndUp ? 344 : 6666"
    >
      <v-card-title class="justify-center">Sign up</v-card-title>
      <form @submit.prevent>
          <v-text-field filled v-model.trim="signupForm.name" type="text" placeholder="Name*" id="name"></v-text-field>
          <v-text-field filled v-model.trim="signupForm.title" type="text" placeholder="Profession" id="title"></v-text-field>
          <v-text-field filled v-model.trim="signupForm.email" type="text" placeholder="you@email.com*" id="email2"></v-text-field>
          <v-text-field filled v-model.trim="signupForm.password" type="password" placeholder="Password*" hint="min 6 characters" id="password2"></v-text-field>
          <v-card-actions class="pl-0">
            <v-btn type="submit" color="primary" @click="signup()">Sign Up</v-btn>
            <!-- ERROR HANDLING -->
            <span v-if="error" class="ml-3 error--text">
              {{error}}
            </span>
          </v-card-actions>
          <span class="caption grey--text">
            <router-link to="/login">Back to Log In</router-link>
          </span>
      </form>
    </v-card>
</template>

<script>
  export default {
    name: 'SignUp',
    
    data () {
      return {
        error: '',
        signupForm: {
          name: '',
          title: '',
          email: '',
          password: ''
        }
      }
    },

    methods: {
      signup() {
        //console.log(this.signupForm);
        this.$store.dispatch('signup', {
          email: this.signupForm.email,
          password: this.signupForm.password,
          name: this.signupForm.name,
          title: this.signupForm.title
        }).then(() => {
          console.log('Successful signup.')
          this.error = '';
        }).catch(error => {
          console.log(error);
          console.error(error.message);
          this.error = error.message;
        });
      }
    },

  }
</script>

