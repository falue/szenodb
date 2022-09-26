<template>
    <!-- SIGNUP FORM -->
    <v-card
      :class="$vuetify.breakpoint.smAndDown ? 'transparent fill-height ma-0 pa-4' : 'mx-auto my-4 mt-12 pa-8 pt-4'"
      :max-width="$vuetify.breakpoint.mdAndUp ? 344 : 6666"
      max-height="80%"
      :flat="$vuetify.breakpoint.smAndDown"
      style="overflow-y: auto;"
    >
      <v-card-title class="justify-center">Sign up</v-card-title>
      <form @submit.prevent>
          <v-text-field filled v-model.trim="signupForm.name" type="text" placeholder="Name*" id="name"></v-text-field>
          <v-text-field filled v-model.trim="signupForm.title" type="text" placeholder="Profession" id="title"></v-text-field>
          <v-text-field filled v-model.trim="signupForm.email" type="text" placeholder="Email*" id="email2"></v-text-field>
          <v-text-field filled v-model.trim="signupForm.password" type="password" placeholder="Password*" hint="min 6 characters" id="password2"></v-text-field>
          <v-card-actions class="px-0">
            <v-btn to="/login">Back</v-btn>
            <v-spacer></v-spacer>
            <v-btn type="submit" color="primary" @click="signup()">Sign Up</v-btn>
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
          password: ''
        }
      }
    },
    created() {
      this.signupForm.email = this.$route.query.email;
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
          this.$toasted.global.error({msg:error.message});
        });
      }
    },

  }
</script>

