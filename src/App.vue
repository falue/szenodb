<template>
  <v-app lang="en-GB">
    <SiteNav :auth="isLoggedIn" :user="this.userProfile" :settings="globalSetting"></SiteNav>

    <v-main class="pt-10" :style="$vuetify.breakpoint.smAndDown ? 'background-color: #1E1E1E' : ''">
      <v-container class="pa-0">
        <router-view v-if="$route.meta.requiresAuth ? userProfile.email : true" :auth="isLoggedIn" :user="this.userProfile" :settings="globalSetting"/>
      </v-container>
    </v-main>

    <!-- WELCOME DIALOG -->
    <v-dialog
      v-model="welcomeDialog"
      :width="$vuetify.breakpoint.smAndDown ? '85%' : '45%'"
      :fullscreen="$vuetify.breakpoint.xs"
      persistent
    >
      <v-card>
        <v-card-title class="text-h5 grey darken-3" style="word-break: initial;">
          Welcome - but before you start:
        </v-card-title>
        <v-card-text class="mt-4 white--text pt-4">
          This is two things:
          A list of resources of goods & services,
          and a cooperative network to find others and be found.
          <br>
          This project is in BETA; some bugs may occur.

          <v-card-actions class="pl-0 pt-4 pb-4">
            <v-spacer></v-spacer>
            <v-spacer></v-spacer>
            <v-icon small color="pink">mdi-heart</v-icon>
            <v-spacer></v-spacer>
            <v-icon small color="pink">mdi-hammer-wrench</v-icon>
            <v-spacer></v-spacer>
            <v-icon small color="pink">mdi-format-paint</v-icon>
            <v-spacer></v-spacer>
            <v-icon small color="pink">mdi-sofa-single</v-icon>
            <v-spacer></v-spacer>
            <v-icon small color="pink">mdi-truck-cargo-container</v-icon>
            <v-spacer></v-spacer>
            <v-icon small color="pink">mdi-desktop-classic</v-icon>
            <v-spacer></v-spacer>
            <v-icon small color="pink">mdi-head-flash</v-icon>
            <v-spacer></v-spacer>
            <v-spacer></v-spacer>
          </v-card-actions>
          
          <v-card-actions align="center" class="pl-0 pt-4">
            <v-spacer></v-spacer>
            <span class="orange--text pr-2">
              BEWARE:
            </span> The rules of szenodb:
            <v-spacer></v-spacer>
          </v-card-actions>
          <ol class="niceList mt-4 pl-0">
            <li>
              You do not talk about
              <span class="overline pink--text" style="line-height:1em">szeno&middot;DB</span>
              to <span class="orange--text">people on the resources list</span>
              (they do not know they're on it)
            </li>
            <li class="italics">
              You do <span class="bolder">not</span> talk about
              <span class="overline pink--text" style="line-height:1em">szeno&middot;DB</span>
              to <span class="orange--text">people on the resources list</span>
              (they do not know they're on it)
            </li>
            <li>
              You do talk a <span class="bolder"><span class="grey--text">*</span>lot<span class="grey--text">*</span></span>
              about <span class="overline pink--text" style="line-height:1em">szeno&middot;DB</span>
              to <span class="orange--text">colleagues in the industry</span>
            </li>
            <li>
              Be nice and don't demand services like you're in a marketplace.
            </li>
            <li>
              This is a starting point for your own research.
            </li>
            <li>
              Double check. Some things might be outdated. 
            </li>
            <li>
              Be professional.
            </li>
            <li>
              Edit, create new, improve; become a colleague. <span class="italics pink--text">Or not, and just use it!</span>
            </li>
          </ol>
          <br>
          Thats all. Enjoy.
          <v-icon small color="rgba(255,0,255,.5)">mdi-heart</v-icon> Fabian

        </v-card-text>
        <v-card-actions class="grey darken-3">
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="welcomeDialog = false" :disabled="!blockWelcomeDialogClosing">
            {{blockWelcomeDialogClosing ? 'Join the community!' : 'Please read the rules'}}
            <v-progress-circular
              :size="16"
              :width="2"
              v-if="!blockWelcomeDialogClosing"
              indeterminate
              color="primary"
              class="ml-1"
            ></v-progress-circular>
          </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
    
    <!-- FOOTER -->
    <v-card-title :style="$route.name === 'Resources' ? 'background-color:#121212;' : ''" style="z-index: 1;" class="text-shadow--black caption pink--text justify-center pa-0 ma-0">
      <span class="overline" style="line-height:1em">szeno&middot;DB <span style="text-transform:lowercase;">v</span>{{appVersion}}</span>
      <span class="px-1">made with <v-icon small color="rgba(255,0,255,.5)">mdi-heart</v-icon> by</span>
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
      welcomeDialog: false,
      blockWelcomeDialogClosing: false,
      message: {
        'welcome': 'Welcome to this fantastic experience!',
        'loggedIn': 'You have successfully been logged in.',
        'loggedOut': 'You have been logged out.',
        'kicked': 'You have been banned from this system.',
        'missingUserFile': `Oh no, your user file is missing! Get in contact with the &nbsp;<a href="mailto:info@fluescher.ch?subject=szenodb.ch%3A%20Missing%20User%20File&body=Hi%2C%0Athere%20seems%20to%20be%20my%20user%20file%20missing.%0A%0AUser%20ID%3A%20${this.$route.query.id}%0A%0AThanks%21">admin here</a>!`,
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
          if(this.$route.query.info === 'welcome') {
            this.showWelcomeDialog();
            return
          }
          this.$toasted.global.info({
            msg: this.message[this.$route.query.info] ? this.message[this.$route.query.info] : this.getMultipleMessages(this.$route.query.info),
          });
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
    showWelcomeDialog() {
      this.welcomeDialog = true;
      this.$router.push({path: this.$route.path, query: { 
        ...(this.$route.query.view && {view: this.$route.query.view}),
        ...(this.$route.query.user && {user: this.$route.query.user}),
      }})
      setTimeout(() => {
          this.blockWelcomeDialogClosing = true;
      }, 6500);
    },
  }
};
</script>

<style scoped>
  .v-image__image--preload {
    filter: none;
  }
  ol.niceList {
   list-style: none;
   counter-reset: item;
   margin-left: 2em;
 }
 .niceList li {
   counter-increment: item;
   padding-bottom: .5em;
 }
 .niceList li:before {
   position: absolute;
   left:1.75em;
   font-weight: bolder;
   content: '\00a0'counter(item)'.';
   background: #2196F3;
   border-radius: 100%;
   color: white;
   width: 1.5em;
   height: 1.5em;
   text-align: center;
   display: inline-block;
 }
</style>