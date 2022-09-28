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

      <!-- Breakpoint helpers -->
      <!-- https://vuetifyjs.com/en/features/breakpoints/#breakpoint-service -->
      <div class="fixed top left pa-3 text-h4" style="background-color:rgba(0,0,0,0.75)">
        <span class="px-1" :class="$vuetify.breakpoint.xs ? 'green--text' : 'grey--text text--darken-2'">{{$vuetify.breakpoint.xs ? 'XS' : 'XS'}}</span>
        <span class="px-1" :class="$vuetify.breakpoint.sm ? 'green--text' : 'grey--text text--darken-2'">{{$vuetify.breakpoint.sm ? 'SM' : 'SM'}}</span>
        <span class="px-1" :class="$vuetify.breakpoint.md ? 'green--text' : 'grey--text text--darken-2'">{{$vuetify.breakpoint.md ? 'MD' : 'MD'}}</span>
        <span class="px-1" :class="$vuetify.breakpoint.lg ? 'green--text' : 'grey--text text--darken-2'">{{$vuetify.breakpoint.lg ? 'LG' : 'LG'}}</span>
        <span class="px-1" :class="$vuetify.breakpoint.xl ? 'green--text' : 'grey--text text--darken-2'">{{$vuetify.breakpoint.xl ? 'XL' : 'XL'}}</span>
      </div>

      <!-- PUBLIC NAV -->
      <v-tooltip open-delay="1250" :open-on-click="false" bottom :disabled="$vuetify.breakpoint.smAndDown">
        <template v-slot:activator="{ on, attrs }">
          <v-btn text :icon="$vuetify.breakpoint.xs" dense small to="/about" class="mx-1 primary--text" v-bind="attrs" v-on="on">
            <v-icon v-if="$vuetify.breakpoint.smAndDown" color="primary">mdi-information-outline</v-icon>
            <span v-else>What's this?</span>
          </v-btn>
        </template>
        <span>More info about this</span>
      </v-tooltip>

      <!-- LOGGED OUT NAV -->
      <!-- <router-link v-if="!auth" to="/login">
        <v-bt primary" depressed>Login</v-btn>
      </router-link> -->

      <v-tooltip open-delay="1250" :open-on-click="false" bottom v-if="!auth" :disabled="$vuetify.breakpoint.smAndDown">
        <template v-slot:activator="{ on, attrs }">
          <v-btn text :icon="$vuetify.breakpoint.xs" dense small to="/login" class="mx-1 primary--text" v-bind="attrs" v-on="on">
            <v-icon v-if="$vuetify.breakpoint.smAndDown" color="primary">mdi-login-variant</v-icon>
            <span v-else>login</span>
          </v-btn>
        </template>
        <span>Login to see the goodies</span>
      </v-tooltip>

      <!-- LOGGED IN NAV -->
      <div v-if="auth">
        <v-tooltip open-delay="1250" :open-on-click="false" bottom :disabled="$vuetify.breakpoint.smAndDown">
          <template v-slot:activator="{ on, attrs }">
            <v-btn text :icon="$vuetify.breakpoint.xs" dense small circle to="/resources" class="mx-1 primary--text" v-bind="attrs" v-on="on">
              <v-icon v-if="$vuetify.breakpoint.smAndDown" color="primary">mdi-format-list-text</v-icon>
              <span v-else>Resources</span>
            </v-btn>
          </template>
          <span>See & edit the list of resources</span>
        </v-tooltip>

        <v-tooltip open-delay="1250" :open-on-click="false" bottom :disabled="$vuetify.breakpoint.smAndDown">
          <template v-slot:activator="{ on, attrs }">
            <v-btn text :icon="$vuetify.breakpoint.xs" dense small circle to="/goodies" class="mx-1 primary--text" v-bind="attrs" v-on="on">
              <v-icon v-if="$vuetify.breakpoint.smAndDown" color="primary">mdi-cupcake</v-icon>
              <span v-else>Goodies</span>
            </v-btn>
          </template>
          <span>An assortment of things</span>
        </v-tooltip>

        <v-tooltip open-delay="1250" :open-on-click="false" bottom v-if="user.role === 'admin'" :disabled="$vuetify.breakpoint.smAndDown">
          <template v-slot:activator="{ on, attrs }">
            <v-btn text :icon="$vuetify.breakpoint.xs" dense small circle to="/admin" class="mx-1 primary--text" v-bind="attrs" v-on="on">
              <v-icon v-if="$vuetify.breakpoint.smAndDown" color="primary">mdi-wrench</v-icon>
              <span v-else>Admin</span>
            </v-btn>
          </template>
          <span>Manage users & backups</span>
        </v-tooltip>

        <v-tooltip open-delay="1250" :open-on-click="false" bottom :disabled="$vuetify.breakpoint.smAndDown">
          <template v-slot:activator="{ on, attrs }">
            <v-btn text icon small :circle="$vuetify.breakpoint.mdAndUp" to="/profile" class="mx-1" v-bind="attrs" v-on="on">
              <v-icon color="primary">mdi-account-cowboy-hat</v-icon>
            </v-btn>
          </template>
          <span>Profile {{user.name}}</span>
        </v-tooltip>

        <v-tooltip open-delay="1250" :open-on-click="false" bottom :disabled="$vuetify.breakpoint.smAndDown">
          <template v-slot:activator="{ on, attrs }">
            <v-btn text icon small :circle="$vuetify.breakpoint.mdAndUp" @click="logout()" class="mx-1" v-bind="attrs" v-on="on">
              <v-icon :small="$vuetify.breakpoint.mdAndUp" color="primary">mdi-logout-variant</v-icon>
            </v-btn>
          </template>
          <span>Logout</span>
        </v-tooltip>
        
        <!-- <div x-small class="white--text absolute right caption nudge-y-150">
          <v-icon color="white" x-small>mdi-account-circle</v-icon>
          {{user.name}}
        </div> -->

        <!-- {{settings}} -->
        <v-btn v-if="settings && settings.maintenance && user.role == 'admin'" small to="/admin" class="mx-1 error">
          <v-icon :small="$vuetify.breakpoint.mdAndUp" color="yellow">mdi-warning</v-icon>
          Maintenance mode
        </v-btn>
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
    settings: Object,
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