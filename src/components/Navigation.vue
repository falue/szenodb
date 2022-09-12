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
        :continuous="true"
        height="40"
        hide-delimiter-background
        hide-delimiters
        interval="4444"
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
      <v-card-title v-if="$vuetify.breakpoint.mdAndUp" class="overline pink--text">
      szeno&middot;DB
      </v-card-title>

      <v-spacer></v-spacer>

      <!-- PUBLIC NAV -->
      <v-tooltip bottom :disabled="$vuetify.breakpoint.smAndDown">
        <template v-slot:activator="{ on, attrs }">
          <v-btn dense small to="/about" class="mx-1 primary--text" v-bind="attrs" v-on="on">
            <v-icon v-if="$vuetify.breakpoint.smAndDown" color="primary">mdi-information</v-icon>
            <span v-else>What's this?</span>
          </v-btn>
        </template>
        <span>More info about this</span>
      </v-tooltip>

      <!-- LOGGED OUT NAV -->
      <!-- <router-link v-if="!auth" to="/login">
        <v-bt primary" depressed>Login</v-btn>
      </router-link> -->

      <v-tooltip bottom v-if="!auth" :disabled="$vuetify.breakpoint.smAndDown">
        <template v-slot:activator="{ on, attrs }">
          <v-btn dense small to="/login" class="mx-1 primary--text" v-bind="attrs" v-on="on">
            login
          </v-btn>
        </template>
        <span>Login to see the goodies</span>
      </v-tooltip>

      <!-- LOGGED IN NAV -->
      <div v-if="auth">
        <v-tooltip bottom :disabled="$vuetify.breakpoint.smAndDown">
          <template v-slot:activator="{ on, attrs }">
            <v-btn dense small circle to="/resources" class="mx-1 primary--text" v-bind="attrs" v-on="on">
              <v-icon v-if="$vuetify.breakpoint.smAndDown" color="primary">mdi-format-list-text</v-icon>
              <span v-else>Resources</span>
            </v-btn>
          </template>
          <span>See & edit the list of resources</span>
        </v-tooltip>

        <v-tooltip bottom :disabled="$vuetify.breakpoint.smAndDown">
          <template v-slot:activator="{ on, attrs }">
            <v-btn dense small circle to="/goodies" class="mx-1 primary--text" v-bind="attrs" v-on="on">
              <v-icon v-if="$vuetify.breakpoint.smAndDown" color="primary">mdi-cupcake</v-icon>
              <span v-else>Goodies</span>
            </v-btn>
          </template>
          <span>An assortment of things</span>
        </v-tooltip>

        <v-tooltip bottom :disabled="$vuetify.breakpoint.smAndDown">
          <template v-slot:activator="{ on, attrs }">
            <v-btn small :icon="$vuetify.breakpoint.mdAndUp" :circle="$vuetify.breakpoint.mdAndUp" to="/profile" class="mx-1 grey darken-3" v-bind="attrs" v-on="on">
              <v-icon color="primary">mdi-account-cowboy-hat</v-icon>
            </v-btn>
          </template>
          <span>Profile {{user.name}}</span>
        </v-tooltip>

        <v-tooltip bottom :disabled="$vuetify.breakpoint.smAndDown">
          <template v-slot:activator="{ on, attrs }">
            <v-btn small :icon="$vuetify.breakpoint.mdAndUp" :circle="$vuetify.breakpoint.mdAndUp" @click="logout()" class="mx-1 grey darken-3" v-bind="attrs" v-on="on">
              <v-icon :small="$vuetify.breakpoint.mdAndUp" color="primary">mdi-logout-variant</v-icon>
            </v-btn>
          </template>
          <span>Logout</span>
        </v-tooltip>
        
        <!-- <div x-small class="white--text absolute right caption nudge-y-150">
          <v-icon color="white" x-small>mdi-account-circle</v-icon>
          {{user.name}}
        </div> -->
      </div>

      <v-spacer v-if="$vuetify.breakpoint.mdAndUp"></v-spacer>
      
      <v-btn v-if="auth && !user.emailVerified" title="Please verify your email address" small class="red mx-1" :style="$vuetify.breakpoint.mdAndUp ? 'width:161px;' : ''" to="/profile?hint=verifyEmail" type="submit" color="">
        <span v-if="$vuetify.breakpoint.mdAndUp">Please verify email</span>
        <v-icon small v-else>mdi-email-remove</v-icon>
      </v-btn>
      <div v-else-if="$vuetify.breakpoint.mdAndUp" style="width:161px;"></div>

    </v-app-bar>
  </v-container>
</template>

<script>
export default {
  props: {
    auth: Boolean,
    user: Object,
  },
  data() {
    return {
      on: false,
      attrs: false,
      slides: [
        'mdi-heart',
        'mdi-hammer-wrench',
        'mdi-format-paint',
        'mdi-sofa-single',
        'mdi-truck-cargo-container',
        'mdi-desktop-classic',
        'mdi-head-flash',
      ],
    }
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