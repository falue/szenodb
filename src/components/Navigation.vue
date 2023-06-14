<template>
  <v-container>
    <v-app-bar
      app
      color="black"
      dark
      clipped-left
      elevation="0"
      sha
    >
      <v-btn icon class="ml-0" style="background-color:rgba(255,0,255,.2)" to="/" v-bind="attrs" v-on="on">
      <v-carousel
        cycle
        :continuous="false"
        height="40"
        hide-delimiter-background
        hide-delimiters
        interval="444"
        vertical
        hide-arrows
        :show-arrows="false"
        touchless
      >
        <v-carousel-item
          v-for="(slide, i) in slides"
          :key="i"
        >
          <v-sheet
            height="100%"
            color="transparent"
          >
            <v-row
              class="fill-height"
              align="center"
              justify="center"
            >
              <v-icon class="pink--text" large>{{ slide }}</v-icon>
            </v-row>
          </v-sheet>
        </v-carousel-item>
      </v-carousel>
      </v-btn>
      <v-card-title class="overline pink--text" style="line-height:1.5em">
        szeno&middot;DB
        <br>
        BETA
      </v-card-title>

      <v-spacer></v-spacer>

      <!-- Breakpoint helpers -->
      <!-- https://vuetifyjs.com/en/features/breakpoints/#breakpoint-service -->
      <!-- <div class="fixed top left pa-3 text-h4" style="background-color:rgba(0,0,0,0.75)">
        <span class="px-1" :class="$vuetify.breakpoint.xs ? 'green--text' : 'grey--text text--darken-2'">{{$vuetify.breakpoint.xs ? 'XS' : 'XS'}}</span>
        <span class="px-1" :class="$vuetify.breakpoint.sm ? 'green--text' : 'grey--text text--darken-2'">{{$vuetify.breakpoint.sm ? 'SM' : 'SM'}}</span>
        <span class="px-1" :class="$vuetify.breakpoint.md ? 'green--text' : 'grey--text text--darken-2'">{{$vuetify.breakpoint.md ? 'MD' : 'MD'}}</span>
        <span class="px-1" :class="$vuetify.breakpoint.lg ? 'green--text' : 'grey--text text--darken-2'">{{$vuetify.breakpoint.lg ? 'LG' : 'LG'}}</span>
        <span class="px-1" :class="$vuetify.breakpoint.xl ? 'green--text' : 'grey--text text--darken-2'">{{$vuetify.breakpoint.xl ? 'XL' : 'XL'}}</span>
      </div> -->

      <!-- DESKTOP LINKS -->
      <div v-if="$vuetify.breakpoint.smAndUp">
        <v-tooltip
          v-for="link in links.filter(x => { if((x.auth && auth || !x.auth && !auth || x.auth === 'both') && ( !x.admin || x.admin && (user.role == 'admin'))) return x})"
          :key="link.title"
          open-delay="750" :open-on-click="false" bottom color="#303030">
          <template v-slot:activator="{ on, attrs }">
            <v-btn text :icon="$vuetify.breakpoint.xs" dense small :to="link.to" class="hover px-1 mx-1 primary--text" v-bind="attrs" v-on="on">
              <v-icon :small="$vuetify.breakpoint.mdAndUp" color="">mdi-{{link.icon}}</v-icon>
              <span v-if="$vuetify.breakpoint.mdAndUp" class="ml-1">{{link.title}}</span>
            </v-btn>
          </template>
          <span>{{link.tooltip}}</span>
        </v-tooltip>
      </div>

      <!-- LOGOUT -->
      <v-tooltip v-if="auth && $vuetify.breakpoint.smAndUp" open-delay="0" :open-on-click="false" bottom color="#303030">
        <template v-slot:activator="{ on, attrs }">
          <v-btn text icon small :circle="$vuetify.breakpoint.mdAndUp" @click="logout()" class="mx-1" v-bind="attrs" v-on="on">
            <v-icon :small="$vuetify.breakpoint.mdAndUp" color="pink">mdi-logout-variant</v-icon>
          </v-btn>
        </template>
        <span>Logout</span>
      </v-tooltip>
      
      <v-spacer v-if="$vuetify.breakpoint.mdAndUp"></v-spacer>
      
      <!-- SPECIAL WARNING BUTTONS -->
      <v-btn v-if="auth && !user.emailVerified" small class="red mx-1" :style="$vuetify.breakpoint.mdAndUp ? 'width:161px;' : ''" to="/profile?hint=verifyEmail" type="submit" color="">
        <span v-if="$vuetify.breakpoint.mdAndUp">Please verify email</span>
        <v-icon v-else>mdi-email-remove</v-icon>
      </v-btn>
      <div v-else-if="$vuetify.breakpoint.mdAndUp" style="width:161px;"></div>

      <v-btn v-if="auth && settings && settings.maintenance && user.role == 'admin'" small to="/admin" class="mx-1 error">
        <v-icon :small="$vuetify.breakpoint.mdAndUp" color="yellow">mdi-warning</v-icon>
        Maintenance mode
      </v-btn>

      <!-- MOBILE HAMBURGER -->
      <v-btn @click="menu = !menu" v-if="$vuetify.breakpoint.xs" small color="black">
        <v-icon color="">mdi-menu</v-icon>
      </v-btn>

      <v-btn v-if="!auth && $vuetify.breakpoint.xs && $route.path != '/login'" text icon small :circle="$vuetify.breakpoint.mdAndUp" to="/login" class="mx-1" v-bind="attrs" v-on="on">
        <v-icon :small="$vuetify.breakpoint.mdAndUp" color="primary">mdi-login-variant</v-icon>
      </v-btn>
    </v-app-bar>

    <!-- MOBILE HAMBURGER MENU -->
    <v-navigation-drawer
      v-model="menu"
      v-if="$vuetify.breakpoint.xs"
      fixed
      left
      temporary
      width="80%"
    >
      <v-list-item>
        <v-list-item-content>
          <v-card-title class="overline pink--text pa-0">
            szeno&middot;DB
            <span style="text-transform:lowercase;" class="ml-2">v</span>{{appVersion}}
          </v-card-title>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list dense nav>
        <v-list-item
          v-for="link in links.filter(x => { if((x.auth && auth || !x.auth && !auth || x.auth === 'both') && ( !x.admin || x.admin && (user.role == 'admin'))) return x})"
          :key="link.title"
          :to="link.to"
          @click.native="menu = false"
          link
        >
          <v-list-item-avatar>
            <v-icon color="primary" class="mx-0">mdi-{{ link.icon }}</v-icon>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title>{{ link.title }}</v-list-item-title>
            <v-list-item-subtitle v-if="link.tooltip.length">
            {{ link.tooltip }}
          </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-divider v-if="auth"></v-divider>

        <v-list-item v-if="auth" @click="logout()" link>
          <v-list-item-avatar>
            <v-icon color="pink" class="mx-0">mdi-logout-variant</v-icon>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

  </v-container>
</template>

<script>
import {version} from '../../package'

export default {
  name: 'NavigationComponent',
  props: {
    auth: Boolean,
    user: Object,
    settings: Object,
  },
  data() {
    return {
      on: false,
      attrs: false,
      menu: false,
      appVersion: version,
      links: [
        /* NO AUTH OR BOTH */
        {to: '/about', auth: "both", title: "What's this?", icon: 'information-outline', tooltip: 'What & how, FAQ, guidelines, whodunit? & contact'},
        {to: '/login', auth: false, title: "Login", icon: 'login-variant', tooltip: 'Login to see the goodies'},
        {to: '/signup', auth: false, title: "Sign up", icon: 'account-plus', tooltip: 'Create a new account'},
        /* AUTH */
        {to: '/resources', auth: true, title: 'Resources', icon: 'format-list-text', tooltip: 'See & edit the list of resources'},
        // {to: '/colleagues', auth: true, title: 'Colleagues', icon: 'account-group', tooltip: 'Find people to work for and with you'},
        {to: '/goodies', auth: true, title: 'Goodies', icon: 'cupcake', tooltip: 'An assortment of things'},
        {to: '/admin', auth: true, admin: true, title: 'Admin', icon: 'shield-account', tooltip: 'Manage users & backups'},
        {to: '/profile', auth: true, title: 'Profile', icon: 'account-cowboy-hat', tooltip: `Your profile`},
      ],
      slides: [
        'mdi-hammer-wrench',
        'mdi-format-paint',
        'mdi-sofa-single',
        'mdi-truck-cargo-container',
        'mdi-desktop-classic',
        'mdi-head-flash',
        'mdi-heart',
        'mdi-hammer-wrench',
      ],
    }
  },
  watch: {
  },

  methods: {
    logout() {
      this.$store.dispatch("logout");
    },
  },
  /* beforeMount() {
    console.log(this.$router);
  } */
};
</script>