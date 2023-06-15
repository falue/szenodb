// Migration: https://router.vuejs.org/guide/migration/

// General
import * as Vue from 'vue';
import { createRouter } from 'vue-router'
import { auth } from '../firebase'
import store from "../store";

// Views
import Home from '../views/Home.vue'
import Admin from '../views/Admin.vue'
import Goodies from '../views/Goodies.vue'
import Resources from '../views/Resources.vue'
import Profile from '../views/Profile.vue'
import Updates from '../views/Updates.vue'
import Privacy from '../views/Privacy.vue'
import Terms from '../views/Terms.vue'
import Consent from '../views/Consent.vue'
import Login from '../views/Login.vue'
import Signup from '../views/Signup.vue'
import ForgotPassword from '../views/ForgotPassword.vue'
import Maintenance from '../views/Maintenance.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/admin',
    name: 'Admin',
    component: Admin,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/resources',
    name: 'Resources',
    component: Resources,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/goodies',
    name: 'Goodies',
    component: Goodies,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/terms',
    name: 'Terms',
    component: Terms,
  },
  {
    path: '/consent',
    name: 'Consent',
    component: Consent,
  },
  {
    path: '/privacy',
    name: 'Privacy',
    component: Privacy,
  },
  {
    path: '/updates',
    name: 'Updates',
    component: Updates,
  },
  {
    path: '/signup',
    name: 'Signup',
    component: Signup,
  },
  {
    path: '/maintenance',
    name: 'Maintenance',
    component: Maintenance,
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: ForgotPassword,
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = createRouter({
  mode: 'hash',  // history for clean url but hard refresh equals to 404; hash adds a # in the url
  base: process.env.BASE_URL,
  routes,
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      // If history-back was pressed, scroll to that pposition
      return savedPosition
    } else if(to.path != from.path) {
      return { x: 0, y: 0 }
    }
  }
})

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(x => x.meta.requiresAuth)
  // If page was hard reloaded; settings is empty, load settigns
  if ((requiresAuth && !from.name) || ((requiresAuth || to.path === '/maintenance' ) && !store.state.settings.maintenance)) {
    store.dispatch('setSettings');
  }
  // If privacy or terms is newer than what was agreed
  if(
    requiresAuth && auth.currentUser && (
      store.state.userProfile.consent && 
      store.state.settings.consent && (
        !store.state.userProfile.consent.privacy ||
        !store.state.userProfile.consent.terms ||
        store.state.userProfile.consent.privacy.seconds < store.state.settings.consent.privacy.seconds ||
        store.state.userProfile.consent.terms.seconds < store.state.settings.consent.terms.seconds
      )
    )
  ) {
    console.log("not consented / consent not up to date!")
    router.push('/consent?next='+to.fullPath)
  
    // If not logged in where you should
  } else if (requiresAuth && !auth.currentUser) {
    let addQuery = Object.keys(to.query).map(function (key) { 
      return [key, to.query[key]].join('=');
    }).join('&');
    addQuery += '&next='+to.path
    next('/login?error=authRequiered&'+addQuery)

  // If maintenance is happening
  } else if (requiresAuth && store.state.settings.maintenance && store.state.userProfile.role != 'admin') {
    next('/maintenance')

  } else {
    next()
  }
})

// eslint-disable-next-line no-unused-vars
router.afterEach((to, from) => {
  // Use next tick to handle router history correctly
  // see: https://github.com/vuejs/vue-router/issues/914#issuecomment-384477609
  Vue.nextTick(() => {
      document.title = to.meta.title || 'szeno·DB - Find resources & services for the art department';
  });
});

export default router
