<template>
    <!-- SIGNUP FORM -->
    <v-card
      :class="$vuetify.breakpoint.smAndDown ? 'transparent fill-height ma-0 pa-4' : 'mx-auto my-4 mt-12 pa-8 pt-4'"
      :max-width="$vuetify.breakpoint.mdAndUp ? 344 : 6666"
      max-height="80%"
      :flat="$vuetify.breakpoint.smAndDown"
      style="overflow-y: auto;"
    >
      <v-card-title class="justify-center">Reset password</v-card-title>
      <form @submit.prevent>
        <v-text-field :disabled="auth" filled v-model.trim="email" type="email" label="email" id="email2"></v-text-field>
      </form>

      <v-card-actions class="px-0">
        <v-btn v-if="auth" to="/profile" >Back</v-btn>
        <v-btn v-else to="/Login" >Back</v-btn>
        <v-spacer></v-spacer>
        <v-btn type="submit" color="primary" @click="resetPassword()" >Reset password</v-btn>
      </v-card-actions>
    </v-card>
</template>

<script>
import { auth } from '@/firebase'

  export default {
    name: 'ForgotPassword',

    props: {
      auth: Boolean,
    },

    data () {
      return {
        email: '',
      }
    },
    created() {
      this.email = this.$route.query.email;
    },
    methods: {
      async resetPassword() {
        this.errorMsg = ''
        try {
          await auth.sendPasswordResetEmail(this.email)
          this.$toasted.global.success({msg:"Success! Check your email for a reset link."});
        } catch (err) {
          this.$toasted.global.error({msg:err.message});
        }
      }
    },
  }
</script>
