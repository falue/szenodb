<template>
    <v-card
      :class="$vuetify.breakpoint.xs ? 'transparent fill-height ma-0 pa-4' : 'mx-auto my-4 mt-12 pa-8'"
      :max-width="$vuetify.breakpoint.smAndUp ? 344 : 6666"
      max-height="80%"
      :flat="$vuetify.breakpoint.smAndUp"
      style="overflow-y: auto;"
    >
      <v-card-title class="justify-center">Reset password</v-card-title>
      <form @submit.prevent>
        <v-text-field filled v-model.trim="email" type="email" label="Email" id="email2"></v-text-field>
      </form>

      <v-card-actions class="px-0">
        <v-btn to="/Login" >Back</v-btn>
        <v-spacer></v-spacer>
        <v-btn type="submit" color="primary" @click="requestResetPassword()" >Reset password</v-btn>
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
      async requestResetPassword() {
        try {
          await auth.sendPasswordResetEmail(this.email)
          this.$toasted.global.success({msg:"Check your email inbox for a reset link."});
        } catch (err) {
          this.$toasted.global.error({msg:err.message});
        }
      }
    },
  }
</script>
