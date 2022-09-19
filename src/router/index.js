// General
import Vue from 'vue'
import VueRouter from 'vue-router'
import { auth } from '../firebase'

// Views
import Home from '../views/Home.vue'
import Admin from '../views/Admin.vue'
import Goodies from '../views/Goodies.vue'
import Resources from '../views/Resources.vue'
import Profile from '../views/Profile.vue'
import Login from '../views/Login.vue'
import Signup from '../views/Signup.vue'
import ForgotPassword from '../views/ForgotPassword.vue'

Vue.use(VueRouter)

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
    path: '/signup',
    name: 'Signup',
    component: Signup,
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

const router = new VueRouter({
  mode: 'hash',  // history for clean url but hard refresh equals to 404; hash adds a # in the url
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(x => x.meta.requiresAuth)
  if (requiresAuth && !auth.currentUser) {
    next('/login?error=authRequiered')
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
