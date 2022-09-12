<template>
    <!-- SIGNUP FORM -->
    <v-card
      class="mx-auto my-4 mt-12 pa-4"
      :max-width="$vuetify.breakpoint.mdAndUp ? 344 : 6666"
    >
      <v-card-title class="justify-center">Reset password</v-card-title>
      <form @submit.prevent>
        <v-text-field filled v-model.trim="email" type="email" label="email" placeholder="you@email.com" id="email2"></v-text-field>
      </form>

      <v-card-actions class="pl-0">
        <v-btn type="submit" color="primary" @click="resetPassword()" >Reset</v-btn>
        <span v-if="showSuccess" class="ml-3 success--text">Success! Check your email for a reset link.</span>
        <span v-if="errorMsg !== ''" class="ml-3 error--text">{{ errorMsg }}</span>
      </v-card-actions>

      <span class="caption grey--text">
        <router-link to="/login">Back to Log In</router-link>
      </span>
      
    </v-card>
</template>

<script>
import { auth } from '@/firebase'

  export default {
    name: 'ForgotPassword',
    data () {
      return {
        email: '',
        showSuccess: false,
        errorMsg: ''
      }
    },
    methods: {
      async resetPassword() {
        this.errorMsg = ''
        try {
          await auth.sendPasswordResetEmail(this.email)
          this.showSuccess = true
        } catch (err) {
          this.errorMsg = err.message
        }
      }
    },
  }
</script>
