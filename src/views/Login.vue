<template>
    <!-- LOGIN FORM -->
    <v-card
      :class="$vuetify.breakpoint.smAndDown ? 'transparent fill-height ma-0 pa-4' : 'mx-auto my-4 mt-12 pa-8 pt-4'"
      :max-width="$vuetify.breakpoint.mdAndUp ? 344 : 6666"
      max-height="80%"
      :flat="$vuetify.breakpoint.smAndDown"
      style="overflow-y: auto;"
    >
      <v-card-title class="justify-center">Login</v-card-title>
      <form @submit.prevent>
        <v-text-field filled v-model.trim="loginForm.email" type="text" placeholder="Email" name="username">
        </v-text-field>

        <v-text-field filled v-model.trim="loginForm.password" type="password" placeholder="Password">
        </v-text-field>

        <v-card-actions class="px-0">
          <v-btn :to="`/forgot-password?email=${loginForm.email}`">Forgot PW</v-btn>
          <v-spacer></v-spacer>
          <v-btn :disabled="loginForm.password.length" color="pink" :to="`/signup?email=${loginForm.email}`">Sign up</v-btn>
          <v-spacer></v-spacer>
          <v-btn type="submit" color="primary" @click="login()">Log in</v-btn>
        </v-card-actions>
      </form>
    </v-card>

</template>

<script>
  export default {
    name: 'Login',
    
    data () {
      return {
        error: '',
        loginForm: {
          email: '',
          password: ''
        }
      }
    },

    methods: {
      login() {
        this.$store.dispatch('login', {
          email: this.loginForm.email,
          password: this.loginForm.password
        }).then(() => {
          console.log('Sucessful login.')
        }).catch(error => {
          this.loginForm.password = '';
          console.log(error);
          this.$toasted.global.error({msg:error.message});
        });
      }
    }

  }
</script>

