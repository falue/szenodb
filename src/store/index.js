import Vue from 'vue'
import Vuex from 'vuex'
import * as fb from '../firebase'  // points to file src/firebase.js !
import router from '../router/index'
import { authKeys } from '../auth.js'
let storage = fb.storage;
// let storageRef = storage.ref();

Vue.use(Vuex)

let unsubscribe = [];
let unsubscribeLogin = [];
let unsubscribeSettings = [];

// STORE STUFF
const store = new Vuex.Store({
  state: {
    userProfile: {},
    resources: [],
    settings: {}
  },

  mutations: {
    setUserProfile(state, val) {
      state.userProfile = val
    },
    setResource(state, val) {
      state.resources = val
    },
    setSettings(state, val) {
      state.settings = val
    }
  },

  getters: {
    resources: state => {
      return state.resources;
    },
    settings: state => {
      return state.settings;
    },
  },

  actions: {
    /* SETTINGS */
    setSettings({ commit }) {
      // Ensure only one listener exists
      if (typeof unsubscribeSettings === "function") unsubscribeSettings();
      unsubscribeSettings = fb["db"]
        .collection("settings")
        .doc("settings")
        .onSnapshot((doc) => {
          const settings = doc.data() || {};
          commit("setSettings", settings);
        });
    },

    /*  USER STUFFS */
    async login({ commit, dispatch }, form) {
      try {
        // Sign the user in
        const { user } = await fb.auth.signInWithEmailAndPassword(
          form.email.toLowerCase(),
          form.password
        );
    
        if (!user?.uid) {
          console.error("User UID is undefined. Possible race condition.");
          throw { error: 500, message: "Internal error: Unable to retrieve user UID." };
        }
    
        console.log("User signed in successfully:", user.uid);
    
        // Fetch global settings
        await dispatch("setSettings");
    
        // Fetch and set user profile
        await dispatch("fetchUserProfile", user);
    
        // Update the user's `lastLogin` and `emailVerified` fields
        await fb["db"].collection("users").doc(user.uid).update({
          lastLogin: new Date(),
          emailVerified: user.emailVerified,
        });

        // Add points for existing!
        store.dispatch('addContribution', 1);
    
        console.log("Login process completed successfully.");
        router.push("/resources?success=loggedIn");
        return true;
      } catch (error) {
        if (error?.code === "permission-denied") {
          console.warn("User appears to be kicked or lacks permissions.");
          console.error(error);
          await fb.auth.signOut();
          commit("setUserProfile", {});
          router.push("/login?error=kicked");
        } else {
          console.error("An error occurred during login.");
          console.error(error);
          // Propagate the error for further handling if necessary
          throw error;
        }
      }
    },

    async logout({ commit }, next='success') {
      if(typeof unsubscribeSettings === 'function') unsubscribeSettings();
      if(typeof unsubscribeLogin === 'function') unsubscribeLogin();
      store.dispatch('unsubscribeAllBut', '');

      await fb.auth.signOut()
      // clear userProfile and redirect to /login
      commit('setUserProfile', {})
      if(next === 'success') {
        router.push('/login?success=loggedOut')
      } else if(next==='kicked') {
        router.push('/login?error=kicked')
      }
    },

    async fetchUserProfile({ commit }, user) {
      try {
        // Unsubscribe from previous listener
        if (typeof unsubscribeLogin === "function") unsubscribeLogin();

        // Attach a listener to the user's Firestore document
        unsubscribeLogin = fb["db"]
          .collection("users")
          .doc(user.uid)
          .onSnapshot((userProfile) => {
            if (!userProfile.exists) {
              console.error("User profile document missing.");
              fb.auth.signOut();
              commit("setUserProfile", {});
              router.push("/login?error=missingUserProfile");
              return;
            }

            // Commit the user profile to the store
            commit("setUserProfile", {
              ...userProfile.data(),
              emailVerified: user.emailVerified,
              uid: user.uid,
              email: user.email,
            });
          });
      } catch (error) {
        console.error("Error fetching user profile:", error);
        throw error.message;
      }
    },

    // eslint-disable-next-line no-unused-vars
    async signup({ dispatch, commit }, form) {
      try {
        // Create new user
        const { user } = await fb.auth.createUserWithEmailAndPassword(
          form.email.toLowerCase(),
          form.password
        );

        // Default user profile
        const userProfile = {
          name: form.name,
          email: form.email.toLowerCase(),
          consent: {
            privacy: form.privacy,
            terms: form.terms,
          },
          role: 'user',
          uid: user.uid,
          favorites: [],
          kicked: false,
          news: form.news,
          emailVerified: false,
          tags: [],           // tags: https://github.com/falue/szenodb/issues/25
          notes: [],          // notes: https://github.com/falue/szenodb/issues/18
          public: false,      // public: https://github.com/falue/szenodb/issues/12
          guiLanguage: 'de',  // guiLanguage: https://github.com/falue/szenodb/issues/14
          darkMode: false,
          contribution: 0,
          avatar: {},
          createdOn: new Date(),
          lastLogin: new Date(),
        };

        // Save user profile to Firestore
        await fb["db"].collection("users").doc(user.uid).set(userProfile);

        // Fetch user profile and settings
        await dispatch("fetchUserProfile", user);
        dispatch("setSettings");

        // Send verification email
        dispatch("sendEmailVerification");

        // Redirect to /resources
        if (router.currentRoute.path === "/signup") {
          router.push("/resources?info=welcome");
        }
      } catch (error) {
        console.error("Error in signup:", error);
        throw error.message;
      }
    },

    sendEmailVerification() {
      try {
        const actionCodeSettings = {
          url: 'https://szenodb.ch/#/resources?success=emailVerified',
          /* iOS: {
            bundleId: 'com.myurl.ios'
          },
          android: {
            packageName: 'com.myurl.android',
            installApp: false,
            minimumVersion: '12'
          },
          handleCodeInApp: false */
        };
        fb.auth.currentUser.sendEmailVerification(actionCodeSettings);
        console.log("Verification email sent.");
      } catch (error) {
        console.error("Error sending verification email:", error);
      }
    },

    addContribution({ state }, add) {
      let contribution = state.userProfile.contribution+add;
      fb["db"].collection("users").doc(state.userProfile.uid).update({'contribution': contribution})
      // RELOAD USER STATE
      store.commit('setUserProfile', {...state.userProfile, 'contribution': contribution })
    },

    // eslint-disable-next-line no-unused-vars
    unsubscribeAllBut({state}, keepAlive) {
      // unsubscribe() to all other .onSnapshot(...):
      const keys = Object.keys(unsubscribe);
      // eslint-disable-next-line no-unused-vars
      keys.forEach((key, index) => {
        // console.log(`${index}. Key:${key}: ${unsubscribe[key]}`);
        if(key !== keepAlive) unsubscribe[key]();
      });
    },

    /* RESOURCES */
    async getResources({state}, limit) {
      // console.log("trigger: store.getResources");

      // Stop listening to other queries, i want to be listening to this now..
      store.dispatch('unsubscribeAllBut', 'getResources');

      // Do not load deleted resources for regular user
      let query = fb["db"].collection('resources').where('flags.deleted', '==', false);
      if(state.userProfile.role === 'admin') {
        query = fb["db"].collection('resources');
      }
      unsubscribe['getResources'] = query.orderBy('createdOn', 'desc').limit(limit).onSnapshot(snapshot => {
        // console.log("READ DOC @ all resources");
        let dataArray = []
        snapshot.forEach(doc => {
          let resource = doc.data()
          resource.id = doc.id
          dataArray.push(resource)
        })
        store.commit('setResource', dataArray)
      })
    },

    async showFavs({state}) {
      // Stop listening to other queries, i want to be listening to this now..
      store.dispatch('unsubscribeAllBut', 'showFavs');

      // Do not load deleted resources for regular user
      let query = fb["db"].collection('resources').where('flags.deleted', '==', false);
      if(state.userProfile.role === 'admin') {
        query = fb["db"].collection('resources');
      }
      unsubscribe['showFavs'] = query.orderBy('createdOn', 'desc').onSnapshot(snapshot => {
        // console.log("READ DOC @ fav resources");
        let dataArray = []
        snapshot.forEach(doc => {
          let resource = doc.data()
          if(state.userProfile.favorites.includes(doc.id)) {
            resource.id = doc.id
            dataArray.push(resource)
          }
        })
        store.commit('setResource', dataArray)
      })
    },

    async showOwnResources({state}) {
      // Stop listening to other queries, i want to be listening to this now..
      store.dispatch('unsubscribeAllBut', 'showOwnResources');

      // Do not load deleted resources for regular user
      let query = fb["db"].collection('resources').where('flags.deleted', '==', false);
      if(state.userProfile.role === 'admin') {
        query = fb["db"].collection('resources');
      }
      unsubscribe['showOwnResources'] = query.where('userId', '==', state.userProfile.uid).orderBy('createdOn', 'desc').onSnapshot(snapshot => {
        // console.log("READ DOC @ your own resources");
        let dataArray = []
        snapshot.forEach(doc => {
          let resource = doc.data()
          resource.id = doc.id
          dataArray.push(resource)
        })
        store.commit('setResource', dataArray)
      })
    },

    async showDeletedFlags() {
      // Stop listening to other queries, i want to be listening to this now..
      store.dispatch('unsubscribeAllBut', 'showDeletedFlags');

      unsubscribe['showDeletedFlags'] = fb["db"].collection('resources').where('flags.deleted', '==', true).orderBy('flags.date', 'desc').onSnapshot(snapshot => {
        // console.log("READ DOC @ deleted resources");
        let dataArray = []
        snapshot.forEach(doc => {
          let resource = doc.data()
          resource.id = doc.id
          dataArray.push(resource)
        })
        store.commit('setResource', dataArray)
      })
    },

    async addResource({ state }, {id, collection, post}) {  //state, commit  //
      // return if user email not verified
      if(!state.userProfile.emailVerified) throw new Error('Please verify your email address');
      // make sure to not write in not allowed collections if not admin
      if(state.userProfile.role !== 'admin' && !["resources", "posts", "texts"].includes(collection)) {
        console.error("Error writing document: Not allowed");
        // makes the dispatch command in component go "catch" as error
        throw {'message': "Error writing document: Not allowed"};
      }
      let creationDate = new Date();

      // TRANSLATE TEXT FIRST TO ARRAY
      let translations = await store.dispatch('translateResource', post);
      post.originalLang = translations.originalLang;
      post.translations = translations.translations;

      // BUILD SEARCHFIELD
      post.searchfield = await store.dispatch('buildSearchfield', post);

      // WRITE TO DB
      console.log("received id: ", id);
      await fb["db"].collection(collection).doc(id).set({
      //await fb["db"].collection(collection).add({
        createdOn: creationDate,
        editedOn: creationDate,
        content: post,
        userId: fb.auth.currentUser.uid,
        userName: state.userProfile.name,
        flags: {
          status: false,
          unreliable: false,
          deleted: false,
        }
      }).then(function() {
        store.dispatch('addContribution', 4);
        return true
      }).catch(function(error) {
        throw error;
      });
    },

    // eslint-disable-next-line no-unused-vars
    buildSearchfield({state}, data) {
      // Get document into data...
      let fields = [
        data.title,
        data.name,
        data.resources,
        data.info,
        data.address,
        data.tel,
        data.email,
        data.web,
        data.translations["DE"].info,
        data.translations["DE"].resources,
        data.translations["EN-GB"].info,
        data.translations["EN-GB"].resources,
        data.translations["FR"].info,
        data.translations["FR"].resources,
        data.translations["IT"].info,
        data.translations["IT"].resources,
      ]
      return fields.join('').replace(/[^0-9a-zA-Z]/g, '').toLowerCase();
    },

    async editResource({ state }, {collection, document, post, oldData}) {
      // return if user email not verified
      if(!state.userProfile.emailVerified) throw new Error('Please verify your email address');
      // make sure to not write in not allowed collections if not admin
      if(state.userProfile.role !== 'admin' && !["resources", "posts", "texts", "users"].includes(collection)) {
        console.error("Error writing document: Not allowed");
        // makes the dispatch command in component go "catch" as error
        throw {'message': "Error writing document: Not allowed"};
      }

      // TRANSLATE TEXT FIRST TO ARRAY
      // if post.resources or post.info was changed, update translation:
      if(oldData.resources != post.resources || oldData.info != post.info) {
        let translations = await store.dispatch('translateResource', post);
        post.originalLang = translations.originalLang;
        post.translations = translations.translations;
      }

      // BUILD SEARCHFIELD
      post.searchfield = await store.dispatch('buildSearchfield', post);

      await fb["db"].collection(collection).doc(document).update({
        editedOn: new Date(),
        content: post,
        userIdEdited: fb.auth.currentUser.uid,
        userNameEdited: state.userProfile.name,
      }).then(async function() {
        store.dispatch('addContribution', 2);
        return true
      }).catch(function(error) {
        throw error;
      });
    },

    async deleteResource({ state }, {collection, document}) {
      // return if user email not verified
      if(!state.userProfile.emailVerified) throw new Error('Please verify your email address');
      // make sure to not write in not allowed collections if not admin
      if(state.userProfile.role !== 'admin' && !["resources", "posts", "texts"].includes(collection)) {
        console.error("Error writing document: Not allowed");
        // makes the dispatch command in component go "catch" as error
        throw {'message': "Error writing document: Not allowed"};
      }
      await fb["db"].collection(collection).doc(document).delete().then(function() {
        store.dispatch('deleteFolder', `resources/${document}`);
        return true
      }).catch(function(error) {
        throw error;
      });
    },
    
    // eslint-disable-next-line no-unused-vars
    async translate({ state }, {text, lang}) {
      return await Vue.prototype.$deepl({
        text: text,
        // source_lang: '...',  // omittable
        target_lang: lang,
        auth_key: authKeys.deepl.auth_key,
        free_api: true,
      })
      .then(async result => {
        // console.log(result.data);
        // console.log(result.data.translations);
        // console.log(result.data.translations[0].text);
        // console.log(result.data.translations[0].detected_source_language);
        return result.data.translations;
      })
      .catch(error => {
        console.error(error);
        // Do not break further script if error was
        //   429: too many requests (too fast) or
        //   456: quota exceeded (more than 500K chars/month in free API mode)
        // See https://www.deepl.com/docs-api/api-access/error-handling/
        return [
          {'text': '', 'detected_source_language': 'EN'},
          {'text': '', 'detected_source_language': 'EN'},
        ];
      });
    },
    
    // eslint-disable-next-line no-unused-vars
    async translateResource({ state }, data) {
      let targetLangs = ['DE', 'FR', 'EN-GB', 'IT'];
      let translations = {
        'DE': {}, 'FR': {}, 'EN-GB': {}, 'IT': {}
      };

      let originalLang = 'DE';

      let fieldsToTranslate = [data.resources, data.info];
      let objectKeys = ['resources', 'info'];
      
      for (let i = 0; i < targetLangs.length; i++) {
        await store.dispatch('translate', {'text': fieldsToTranslate, 'lang': targetLangs[i]}).then(function(text) {
          for (let x = 0; x < text.length; x++) {
            // Takes only the language from the last field => .info
            if(text[x].text.length) {
              originalLang = text[x].detected_source_language === 'EN' ? 'EN-GB' : text[x].detected_source_language;
            }
            translations[targetLangs[i]][objectKeys[x]] = text[x].text;
          }
        });
      }
      return {originalLang, translations}
    },

    searchResources({commit, state}, payload) {
      // console.log("trigger: store.searchResources")

      // Stop listening to other queries, i want to be listening to this now..
      store.dispatch('unsubscribeAllBut', 'searchResources');
      
      // await new Promise(resolve => setTimeout(resolve, 3000));
      payload = payload.replace(/[^0-9a-zA-Z]/g, '').toLowerCase()
      // Firestore has not search freetext algorythm.. despite being from google.
      // Do not load deleted resources for regular user
      let query = fb["db"].collection('resources').where('flags.deleted', '==', false);
      if(state.userProfile.role === 'admin') {
        query = fb["db"].collection('resources');
      }
      unsubscribe['searchResources'] = query.orderBy('createdOn', 'desc').onSnapshot(snapshot => {
        // console.log("READ DOC @ search resources");
        let dataArray = []
        let primaryDataArray = []
        snapshot.forEach(doc => {
          let resource = doc.data()
          resource.id = doc.id
          let positionOf = resource.content.searchfield?.indexOf(payload);
          if(!payload) {
            // if no search, display results
            dataArray.push(resource)
          } else if(payload && positionOf === 0)  {
            // find exact matches in the title. searchfield has the title first, so position is 0 if title is exact.
            resource.primaryResult=true;
            primaryDataArray.push(resource)
          } else if(payload && positionOf !== -1)  {
            // find matches anywhere
            dataArray.push(resource)
          } else if(state.userProfile.notes[resource.id]?.replace(/[^0-9a-zA-Z]/g, '').toLowerCase().indexOf(payload) >= 0)  {
            // find matches in user.notes.id
            dataArray.push(resource)
          }
        })
        commit('setResource', [...primaryDataArray, ...dataArray]);
      })
    },

    // eslint-disable-next-line no-unused-vars
    async copyCollection({commit}, payload) {
      const documents = await fb["db"].collection(payload.source).get();
      documents.forEach(async (doc)=> {
        await fb["db"].collection(payload.target).doc(doc.id).set(doc.data());
      })
    },
    
    // eslint-disable-next-line no-unused-vars
    async updateField({commit}, {collection, document, field, data}) {
      await fb["db"].collection(collection).doc(document).update({
        [field]: data
      }).then(function() {
        return true
      }).catch(function(error) {
        throw error;
      });
    },

    // eslint-disable-next-line no-unused-vars
    async uploadFile({state}, {file, target, order}) {
      console.log("Because of GUI feedback (loading bar while uploading), this function is in FileUpload.vue directly.")
      console.log(file, target, order)
    },
    
    // eslint-disable-next-line no-unused-vars
    async deleteFile({state}, path) {
      // console.log("delete: ", url);
      let deletRef = storage.ref().child(path);
      // Delete the file
      deletRef.delete().then(() => {
        // File deleted successfully
        console.log("Successfully deleted file @ path ", path);
      }).catch((error) => {
        // Uh-oh, an error occurred!
        console.log("Error while deleting file @ path ", path);
        console.log(error.message);
      });
    },
      
    // eslint-disable-next-line no-unused-vars
    deleteFolder({state}, path) {
      let listRef = storage.ref().child(path);
      listRef.listAll().then((res) => {
        res.items.forEach((itemRef) => {
          // console.log("itemRef.fullPath: ", itemRef.fullPath);
          // All the items under listRef.
          itemRef.delete().then(() => {
            // File deleted successfully
            // console.log("success deleted:", itemRef.fullPath);
          }).catch((error) => {
            // Uh-oh, an error occurred!
            console.log(error);
          });
        })
      }).then(() => {
        // FIXME: Does not async await but yeah
        console.log("Deleted folder ", path)
      }).catch((error) => {
        console.log(error);
        // Uh-oh, an error occurred!
      });
    },


    /* fineSearchResources({state, commit}, payload) {
      console.log(commit)
      console.log(payload)
      let test = state.resources
      test.shift({'aaaaaa': 'bbbbbb'})
      commit('setResource', test)
      console.log(state.resources)
    } */
  }
})

// Get initial resources
// store.dispatch('getResources', 100);

export default store
