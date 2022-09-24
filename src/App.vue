<template>
  <v-app lang="en-GB">
    <SiteNav :auth="isLoggedIn" :user="this.userProfile"></SiteNav>

    <v-main class="pt-10">
      <v-container class="pa-0">
        <router-view :auth="isLoggedIn" :user="this.userProfile"/>
      </v-container>
    </v-main>

<!-- v-if="$vuetify.breakpoint.mdAndUp"  -->
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

export default {
  name: 'App',

  components: {
    SiteNav
  },

  data () {
    return {
      appVersion: version,
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
            msg: this.message[this.$route.query.success] ? this.message[this.$route.query.success] : this.$route.query.success,
          });
        } else if(this.$route.query.error) {
          this.$toasted.global.error({
            msg: this.message[this.$route.query.error] ? this.message[this.$route.query.error] : this.$route.query.error,
          });
        } else if(this.$route.query.info) {
          this.$toasted.global.info({
            msg: this.message[this.$route.query.info] ? this.message[this.$route.query.info] : this.$route.query.info,
          });
        }
      }
    },

    'user.kicked'(val) {
      if(val) {
        console.log("KICKED USER");
        // db.auth.signOut();
        this.$store.dispatch('logout', 'kicked')
        // commit('setUserProfile', {});
        // router.push('/login?error=kicked');
      }
    }
  },

  computed: {
    
    ...mapState(['userProfile', 'posts']),
    isLoggedIn() {
      //console.log("User superprofile: ", this.userProfile);
      return Object.keys(this.userProfile).length > 1;
      //return this.userProfile ? Object.keys(this.userProfile).length > 1 : false;
    },
    user() {
      return this.userProfile  // ??????
    }
  },
};
</script>
