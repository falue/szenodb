<template>
  <div class="ma-0 fill-width fill-height">
    <v-card
      :class="$vuetify.breakpoint.smAndDown ? 'transparent fill-height ma-0 pa-4' : 'mx-auto my-4 mt-12 pa-8'"
      :max-width="$vuetify.breakpoint.mdAndUp ? 666 : 6666"
      max-height="80%"
      style="overflow-y: auto;"
    >
      <!-- <h2>{{$vuetify.breakpoint.xs ? 'xs' : ''}}
      {{$vuetify.breakpoint.sm ? 'sm' : ''}}
      {{$vuetify.breakpoint.md ? 'md' : ''}}
      {{$vuetify.breakpoint.lg ? 'lg' : ''}}
      {{$vuetify.breakpoint.xl ? 'xl' : ''}}
      </h2> -->
      <form @submit.prevent="saveUserData">
        <v-text-field filled class="input" :class="$vuetify.breakpoint.mdAndUp ? 'mr-2' : ''" :style="$vuetify.breakpoint.mdAndUp ? 'width:40%; display:inline-block' : ''" label="Name" type="text" placeholder="Name" v-model="profile.name" required></v-text-field>
        <v-text-field filled class="input" :style="$vuetify.breakpoint.mdAndUp ? 'width:55%; display:inline-block' : ''" label="Profession" type="text" placeholder="Title" v-model="profile.title"></v-text-field>
        <v-text-field filled class="input" :class="$vuetify.breakpoint.mdAndUp ? 'mr-2' : ''" :style="$vuetify.breakpoint.mdAndUp ? 'width:40%; display:inline-block' : ''" label="Role" type="text" placeholder="Role" persistent-hint hint="If admin, you can make changes to the system" v-model="profile.role" disabled></v-text-field>
        <v-text-field filled class="input" :style="$vuetify.breakpoint.mdAndUp ? 'width:55%; display:inline-block' : ''" label="Email" type="text" placeholder="Email" persistent-hint hint="To change your email, please contact the admin" v-model="profile.email" disabled>
          <v-icon :title="user.emailVerified ? 'Email verified' : 'Email not verified'" slot="append" :class="user.emailVerified ? 'green--text' : 'red--text'">{{user.emailVerified  ? 'mdi-check-circle' : 'mdi-close-circle'}}</v-icon>
        </v-text-field>
        <br>

        <v-card-actions :class="$vuetify.breakpoint.mdAndUp ? 'pl-0 pr-6' : 'pa-0'">
          <v-spacer></v-spacer>

          <!-- RESEND VERIFACTION EMAIL -->
          <v-btn v-if="!user.emailVerified" @click="sendEmailVerification()" type="submit" :class="this.$route.query.hint === 'verifyEmail' ? 'error--fade' : ''" color="">
            Resend verification email
          </v-btn>
          
          <v-btn type="submit" color="primary">Save changes
            <v-progress-circular
              :size="16"
              :width="2"
              v-if="loading"
              indeterminate
              color="primary"
            ></v-progress-circular>
          </v-btn>
        </v-card-actions>

        <span v-if="success">
          &emsp;<v-icon color="green">mdi-thumb-up</v-icon>&emsp;
          <span class="success--text">Saved to firestore database!</span>
        </span>

        <span v-if="somethingWrong">
          &emsp;<v-icon color="error">mdi-thumb-down</v-icon>&emsp;
        </span>
        
      </form>

      <br>
      <v-divider class="my-4"></v-divider>
      Your user ID is
      <pre class="grey--text" style="display:inline">{{user.uid}}</pre>
      <Copy :data="user.uid" dataName="user ID"></Copy>
    </v-card>
  </div>
</template>

<script>
import { db } from '../firebase'
import Copy from '@/components/Copy'

  export default {
    name: 'Test',
    props: {
      user: Object,
    },
    components: {
      Copy
    },

    data () {
      return {
        profile: JSON.parse(JSON.stringify(this.user)),  // does not work on hard refresh!
        success: false,
        somethingWrong: false,
        loading: false,
      }
    },

    created() {
    },

    methods: {
      async saveUserData () {
        try {
          this.loading = true;
          await db.collection("users").doc(this.user.uid).update({
            'name': this.profile.name,
            'title': this.profile.title,
            'role': this.profile.role,
            'email': this.profile.email,
          }).then(() => {
            this.success = true;
            console.log('updated profile')
            this.$store.dispatch('fetchUserProfile', this.user)
            this.loading = false;
          })

          // The JSON string/prase thing makes out of timestamp object an
          //   object with seconds/nanoseconds, whicht is not recognized as
          //   timestamp object by FB.
          /* delete this.profile.createdOn;
          delete this.profile.lastLogin;
          db.collection("users")
            .doc(this.user.uid)
            .set(this.profile)
            .then(() => {
              this.success = true;
              console.log('updated profile')
              this.$store.dispatch('fetchUserProfile', this.user)
              this.loading = false;
            }) */
        } catch (err) {
          this.somethingWrong = true;
        }
      },
      
      sendEmailVerification() {
        this.$store.dispatch('sendEmailVerification').then(() => {
          this.$toasted.global.info({msg:"Email sent."});
        }).catch(error => {
          console.log(error);
          console.error(error.message);
          this.$toasted.global.error({msg:error.message});
          return;
        });
      },
    }
  }
</script>
