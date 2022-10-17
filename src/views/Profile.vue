<template>
  <div class="ma-0 fill-width fill-height">
    <v-card
      :class="$vuetify.breakpoint.xs ? 'transparent fill-height ma-0 pa-4' : $vuetify.breakpoint.mdAndUp ? 'mx-auto my-4 mt-12 pa-8' : 'mx-auto my-4 mt-0 pa-8'"
      :max-width="$vuetify.breakpoint.smAndUp ? 666 : 6666"
      max-height="80%"
      :flat="$vuetify.breakpoint.smAndUp"
      style="overflow-y: auto;"
    >

    <!-- user.public: <pre>{{user.public}}</pre> -->
    <!-- profile.public: <pre>{{profile.public}}</pre> -->
    <!-- profile.colleague: <pre>{{profile.colleague}}</pre> -->
    <!-- profile: <pre>{{profile.avatar}}</pre> -->
    <!-- profile.avatar: <pre>{{profile.avatar}}</pre> -->

    <v-card-title class="justify-center pa-0 pb-8">
      <div class="relative">
        <v-avatar :size="120" class="elevation-8">
          <v-img v-if="profile.avatar && profile.avatar.url && profile.avatar.url.length > 0" :src="profile.avatar.url" :alt="user.name"
            class="grey darken-3 "
          />
          <!-- https://avatars.dicebear.com/ -->
          <v-img v-else :src="`https://avatars.dicebear.com/api/adventurer-neutral/${profile.avatar && profile.avatar.random ? profile.avatar.random : $helpers.md5(user.uid)}.svg`" class="grey darken-3" :alt="user.name" />
        </v-avatar>
        <v-btn
          v-if="profile.avatar && user.avatar.url && user.avatar.url.length"
          icon
          small
          dense
          class="absolute top right op-50"
          @click="deleteImage(user.avatar.path)"
        ><v-icon small class="grey--text">mdi-close</v-icon>
        </v-btn>
        <v-btn
          v-else
          icon
          small
          dense
          class="absolute top right"
          @click="getRandomUserImage()"
        ><v-icon small class="primary--text">mdi-sync</v-icon>
        </v-btn>
        <FileUpload
          class="absolute bottom right"
          type="image/*"
          :target="`users/${user.uid}`"
          :multiple="false"
          :maxImageSize="666"
          :icon="profile.avatar && user.avatar.url && user.avatar.url.length ? 'camera' : 'camera-plus'"
          iconClasses=""
          buttonClasses="pink darken-3 elevation-8"
          position="right"
          tooltip="Change avatar"
          @uploadStarted="user.avatar={}"
          @uploaded="profile.avatar=$event, saveUserData()"
          @error="$toasted.global.error({msg:$event})"
        ></FileUpload>
      </div>
    </v-card-title>

      <form @submit.prevent="saveUserData">
        <v-text-field filled class="input" :class="$vuetify.breakpoint.mdAndUp ? 'mr-2' : ''" :style="$vuetify.breakpoint.mdAndUp ? 'width:40%; display:inline-block' : ''" label="Name" type="text" placeholder="Name" v-model="profile.name" :rules="requiered"></v-text-field>
        <v-text-field filled class="input" :style="$vuetify.breakpoint.mdAndUp ? 'width:55%; display:inline-block' : ''" label="Profession" type="text" placeholder="Title" v-model="profile.title"></v-text-field>
        <v-text-field filled class="input" :class="$vuetify.breakpoint.mdAndUp ? 'mr-2' : ''" :style="$vuetify.breakpoint.mdAndUp ? 'width:40%; display:inline-block' : ''" label="Role" type="text" :placeholder="profile.role" persistent-hint hint="If admin, you can make changes to the system" disabled></v-text-field>
        <v-text-field filled class="input" :style="$vuetify.breakpoint.mdAndUp ? 'width:55%; display:inline-block' : ''" label="Email" type="text" placeholder="Email" persistent-hint v-model="profile.email" :rules="requiered">
          <v-icon :title="user.emailVerified ? 'Email verified' : 'Email not verified'" slot="append" :class="user.emailVerified ? 'green--text' : 'red--text'">{{user.emailVerified ? 'mdi-check-circle' : 'mdi-close-circle'}}</v-icon>
        </v-text-field>
        <br>

        <v-card-actions :class="$vuetify.breakpoint.mdAndUp ? 'pl-0 pr-6' : 'pa-0'">
          <v-btn @click="deleteAccountConfirmation = !deleteAccountConfirmation">
            Delete my account
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn v-if="$vuetify.breakpoint.smAndUp" @click="requestResetPassword()">
            Reset password
          </v-btn>
          <v-btn type="submit" color="primary">Save {{$vuetify.breakpoint.smAndUp ? "changes" : ""}}
            <v-progress-circular
              :size="16"
              :width="2"
              v-if="loading"
              indeterminate
              color="primary"
            ></v-progress-circular>
          </v-btn>
        </v-card-actions>
        <v-card-actions :class="$vuetify.breakpoint.mdAndUp ? 'pl-0 pr-6' : 'pa-0 pt-2'">
          <v-spacer v-if="deleteAccountConfirmation"></v-spacer>
          <v-btn v-if="$vuetify.breakpoint.xs && !deleteAccountConfirmation" :to="`/forgot-password?email=${user.email}`">
            Reset password
          </v-btn>
          <v-btn v-if="deleteAccountConfirmation" :disabled="profile.email === 'info@fluescher.ch'" @click="deleteAccount()" color="red">
            {{$vuetify.breakpoint.smAndUp ? 'Delete account now and everything with it.' : 'Delete account now'}}
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn v-if="!deleteAccountConfirmation && !user.emailVerified" @click="sendEmailVerification()" type="submit" :class="this.$route.query.hint === 'verifyEmail' ? 'error--fade' : ''" color="">
            {{$vuetify.breakpoint.xs ? 'Verify email' : 'Resend verification email'}}
          </v-btn>
        </v-card-actions>
        
      </form>

      <br>
      <v-divider class="my-4"></v-divider>
      Your user ID is
      <pre class="grey--text" style="display:inline">{{user.uid}}</pre>
      <Copy :data="user.uid" dataName="user ID"></Copy>
      <br>
      and you have <span class="orange--text">{{user.contribution.toLocaleString()}}</span> contribution points. {{"🥳 ".repeat(user.contribution > 500 ? 5 : user.contribution / 100)}}
      <Info title="Contribution Points" text="are calculated from your activity: Creating or editing resources, and logging in.<br>Currently, they are not used for anything."></Info>
    </v-card>
  </div>
</template>

<script>
import { db, auth } from '../firebase'
import Copy from '@/components/Copy'
import FileUpload from '@/components/FileUpload'
import Info from '@/components/Info'

  export default {
    name: 'Profile',
    props: {
      user: Object,
    },
    components: {
      Copy, Info, FileUpload
    },

    data () {
      return {
        loading: false,
        deleteAccountConfirmation: false,
        requiered: [value => !!value || 'Required.'],
      }
    },

    computed: {
      profile() {
        return JSON.parse(JSON.stringify(this.user));
      }
    },

    methods: {
      async saveUserData () {
        if(this.profile.name.length === 0) {
          this.$toasted.global.error({msg:"Name cannot be empty."});
          return
        }
        if(this.profile.email.length === 0 || !this.$helpers.checkEmail(this.profile.email)) {
          this.$toasted.global.error({msg:"Email is formatted badly."});
          return
        }

        try {
          this.loading = true;
          let changedEmail = this.profile.email != this.user.email
          let newEmail = this.profile.email;

          await db.collection("users").doc(this.user.uid).update({
            'avatar': this.profile.avatar,
            'name': this.profile.name,
            'title': this.profile.title,
            'role': this.profile.role,  // Someone can shape the sent object and overwrite this..
            'email': this.profile.email,
          }).then(() => {
            if(changedEmail) {
              auth.currentUser.updateEmail(newEmail).then(() => {
                this.profile.email = newEmail;
                this.profile.emailVerified = false;
                this.$store.commit('setUserProfile', this.profile)
                this.sendEmailVerification();
                this.$toasted.global.success({msg:"Updated profile & email"});
                this.loading = false;
              }).catch((error) => {
                this.$toasted.global.error({msg:error.message});
                this.loading = false;
              });
            } else {
              this.$toasted.global.success({msg:"Updated profile"});
              this.loading = false;
            }
          })
        } catch (err) {
          console.log(err)
          this.$toasted.global.error({msg:err.message});
          this.loading = false;
        }
      },
      
      sendEmailVerification() {
        this.$store.dispatch('sendEmailVerification').then(() => {
          this.$toasted.global.info({msg:"Verification email sent."});
        }).catch(error => {
          console.log(error);
          console.error(error.message);
          this.$toasted.global.error({msg:error.message});
          return;
        });
      },

      async requestResetPassword() {
        try {
          await auth.sendPasswordResetEmail(this.user.email)
          this.$toasted.global.success({msg:"Check your email inbox for a reset link."});
        } catch (err) {
          this.$toasted.global.error({msg:err.message});
        }
      },

      getRandomUserImage() {
        let randomImg = this.$helpers.createUid();
        // this.user.avatar.random = randomImg;
        this.profile.avatar.random = randomImg;
        this.$forceUpdate();
      },

      deleteImage(current) {
        this.$store.dispatch('deleteFile', current);
        this.user.avatar={};
        this.profile.avatar={};
        this.saveUserData();
      },

      async deleteAccount() {
        // Overwrite existing user file - cannot remove file, because that will trigger logout
        //   & no authority to remove user. Vice versa also!
        await db.collection("users").doc(auth.currentUser.uid).set({
          'deletedUser': true,
          'editedOn': new Date()
        }).then(() => {
          auth.currentUser.delete().then(() => {
            this.$store.commit('setUserProfile', {})
            this.$router.push("/");
            this.$toasted.global.info({msg:"Sad to see you go, but thanks for the ride!"});
          }).catch(function(error) {
            this.$toasted.global.error({msg:error.message});
            throw error;
          });
        }).catch(error => {
          this.$toasted.global.error({msg:error.message});
          throw error;
        });
      }
    }
  }
</script>
