import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import { auth } from "./firebase.js";
import vuetify from "./plugins/vuetify";
import VueMoment from "vue-moment"; // Time calculation
import "../static/vuetify-additions.css";
import helpers from "./assets/helpers"; // Use global helper functions
import Toasted from "vue-toasted"; // alerts & notifications https://github.com/shakee93/vue-toasted
import VuePapaParse from 'vue-papa-parse' // parse csv to json https://www.papaparse.com/
import deepl from 'deepl';  // https://www.npmjs.com/package/deepl

Vue.config.productionTip = false;

// add js helpers to use like this.$helpers.textTruncate(deleteDialog.project.name, 20)
const jsHelpers = {
  install() {
    Vue.helpers = helpers;
    Vue.prototype.$helpers = helpers;
  },
};

Vue.use(jsHelpers);
Vue.use(VueMoment);
Vue.use(VuePapaParse);
// Vue.use(deepl);
Object.defineProperty(Vue.prototype, '$deepl', { value: deepl });


// DEFINE ALERTS
Vue.use(Toasted, {
  iconPack: "mdi",
  keepOnHover: true,
  className: "roboto weight_normal",
  containerClass: "",
});
// success
Vue.toasted.register("success", (payload) => {
    if (!payload.msg) { return "Success!"; } else { return payload.msg; }
  },{ type: "success", icon: "mdi-checkbox-marked-circle", duration: 4000, position: "bottom-left" }
);
// info
Vue.toasted.register("info", (payload) => {
    if (!payload.msg) { return "Info."; } else { return payload.msg; }
  },  { type: "info", icon: "mdi-information", duration: 6000, position: "bottom-left" }
);
// error
Vue.toasted.register("error", (payload) => {
    if (!payload.msg) { return "Something Went Wrong. I can feel it."; } else { return payload.msg; }
  },{ type: "error", icon: "mdi-alert-circle", position: "bottom-left", action : {
      text : 'CLOSE', onClick : (e, toastObject) => { toastObject.goAway(0); }
  },}
);

let app;
auth.onAuthStateChanged((user) => {
  if (!app) {
    app = new Vue({
      router,
      store,
      vuetify,
      render: (h) => h(App),
    }).$mount("#app");
  }

  // if hard reload, fetch logged in user
  if (user) {
    store.dispatch("fetchUserProfile", user);
  }
});
