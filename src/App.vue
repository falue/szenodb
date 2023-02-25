<template>
  <v-app lang="en-GB">
    <SiteNav :auth="isLoggedIn" :user="this.userProfile" :settings="globalSetting"></SiteNav>

    <v-main class="pt-10" :style="$vuetify.breakpoint.smAndDown ? 'background-color: #1E1E1E' : ''">
      <v-container class="pa-0">
        <router-view v-if="$route.meta.requiresAuth ? userProfile.email : true" :auth="isLoggedIn" :user="this.userProfile" :settings="globalSetting"/>
      </v-container>
    </v-main>

    <!-- FOOTER -->
    <v-card-title :style="$route.name === 'Resources' ? 'background-color:#121212;' : ''" style="z-index: 1;" class="text-shadow--black caption pink--text justify-center pa-0 ma-0">
      <span class="overline pr-1" style="line-height:1em">szeno&middot;DB <span style="text-transform:lowercase;">v</span>{{appVersion}}</span>
      <span class="pr-1" v-if="$vuetify.breakpoint.smAndUp">made with <v-icon small color="rgba(255,0,255,.5)">mdi-heart</v-icon> by</span>
      <a href="https://www.telefabi.ch" target="_blank" class="no-underline"><span class=" pink--text ">telefabi.ch</span></a>
    </v-card-title>
    <v-card-title :style="$route.name === 'Resources' ? 'background-color:#121212;' : ''" class="text-shadow--black caption pink--text justify-center pa-0 pb-2 ma-0" style="z-index: 1;">
      <a href="https://github.com/falue/szenodb" title="github repo" target="_blank" class="no-underline" :class="{'bigMobileButton mr-2' : $vuetify.breakpoint.smAndDown}">
        Join the development!
        <v-icon small class="pa-1" color="primary">mdi-github</v-icon>
      </a>
    </v-card-title>
    
  </v-app>
</template>

<script>
import { mapState } from 'vuex'
import SiteNav from '@/components/Navigation'
import {version} from '../package'
import { db, auth } from "./firebase.js";

export default {
  name: 'App',

  components: {
    SiteNav
  },

  data () {
    return {
      appVersion: version,
      message: {
        'welcome': 'Welcome to szenodb! Check your spam folder for the address verification email.',
        'loggedIn': 'You have successfully been logged in.',
        'loggedOut': 'You have been logged out.',
        'kicked': 'You have been banned from this system.',
        'missingUserFile': `Oh no, something happend. Your user file may be missing! Get in contact with the &nbsp;<a href="mailto:info@fluescher.ch?subject=szenodb.ch%3A%20Missing%20User%20File&body=Hi%2C%0Athere%20seems%20to%20be%20my%20user%20file%20missing.%0A%0AUser%20ID%3A%20${this.$route.query.id}%0A%0AThanks%21">admin here</a>!`,
        'emailVerified': 'Thank you for verifying your email.',
        'authRequiered': 'This page needs authentication.',
        'noExistence': 'This page does not yet exist.',  // currently not used
      }
    }
  },
  watch:{
    $route(){
      if(Object.keys(this.$route.query).length > 0) {
        if(this.$route.query.success) {
          this.$toasted.global.success({
            msg: this.message[this.$route.query.success] ? this.message[this.$route.query.success] : this.getMultipleMessages(this.$route.query.success),
          });
          if(this.$route.query.success === 'emailVerified') {
            this.checkUserVerified();
          }
        } else if(this.$route.query.error) {
          this.$toasted.global.error({
            msg: this.message[this.$route.query.error] ? this.message[this.$route.query.error] : this.getMultipleMessages(this.$route.query.error),
          });
          if(this.$route.query.error === 'kicked') {
            this.$router.replace({'query': null});
            return
          }
        } else if(this.$route.query.info) {
          this.$toasted.global.info({
            msg: this.message[this.$route.query.info] ? this.message[this.$route.query.info] : this.getMultipleMessages(this.$route.query.info),
          });
          if(this.$route.query.info === 'welcome') {
            this.$router.push({path: this.$route.path, query: { 
              ...(this.$route.query.view && {view: this.$route.query.view}),
              ...(this.$route.query.user && {user: this.$route.query.user}),
            }})
          }
        }
      }
    },

    'user.kicked'(val) {
      if(val) {
        console.log("KICKED USER");
        this.$store.dispatch('logout', 'kicked')
      }
    }
  },

  computed: {
    ...mapState(['userProfile', 'settings']),
    isLoggedIn() {
      //console.log("User superprofile: ", this.userProfile);
      return Object.keys(this.userProfile).length > 1;
      //return this.userProfile ? Object.keys(this.userProfile).length > 1 : false;
    },
    user() {
      return this.userProfile
    },
    globalSetting() {
      return this.settings
    }
  },

  created() {
    if(this.$route.query.success === 'emailVerified') {
      this.checkUserVerified("created");
    }
  },

  methods: {
    async checkUserVerified(source) {
      // Check if user saved in firebase (not user document in collection "users")
      //   has emailVerified set to true. Write to user document.
      const currentUser = auth.currentUser;
      if (currentUser) {
        //await auth().currentUser.then(async function(user) {
                      // this.$store.dispatch('fetchUserProfile', this.user)
          await db.collection("users").doc(currentUser.uid).update({
            'emailVerified': currentUser.emailVerified
          })
          console.log("written to DB, maybe");
          if(source === 'created') {
            this.$toasted.global.success({
                msg: "Thank you for verifying your email.",
            });
          }
        // });
      } else {
        console.log("User not logged in to check emailVerified. You should be now on /login.")
      }
    },
    getMultipleMessages(queryParams) {
      if(typeof queryParams === 'object') {
        const asArray = Object.values(queryParams);
        let filtered = [];
        asArray.filter((value) => { 
          filtered.push(this.message[value])
        } );
        return filtered.join("<br>");
      } else {
        // Was just string
        return queryParams
      }
    },
  }
};
</script>

<style scoped>
  .v-image__image--preload {
    filter: none;
  }
</style>