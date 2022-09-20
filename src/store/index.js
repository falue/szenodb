import Vue from 'vue'
import Vuex from 'vuex'
import * as fb from '../firebase'
import router from '../router/index'
import { authKeys } from '../auth.js'

Vue.use(Vuex)

// STORE STUFF
const store = new Vuex.Store({
  state: {
    userProfile: {},
    resources: []
  },

  mutations: {
    setUserProfile(state, val) {
      state.userProfile = val
    },
    setResource(state, val) {
      state.resources = val
    }
  },

  getters: {
    // ...
    resources: state => {
      return state.resources;
    },
  },

  actions: {
    /*  USER STUFFS */
    async login({ dispatch }, form) {
      // sign user in
      await fb.auth.signInWithEmailAndPassword(form.email.toLowerCase(), form.password).then(function({ user }) {
        // fetch user profile and set in state
        dispatch('fetchUserProfile', user).then(function() {
          fb["db"].collection("users").doc(user.uid).update({
            'lastLogin': new Date(),
            'emailVerified': user.emailVerified
          })
          store.dispatch('addContribution', 1);
        });
        return true
      }).catch(function(error) {
        throw error;
      });
    },

    async logout({ commit }) {
      await fb.auth.signOut()
      // clear userProfile and redirect to /login
      commit('setUserProfile', {})
      router.push('/login?success=loggedOut')
    },

    async fetchUserProfile({ commit }, user) {
      // fetch user profile
      return fb.usersCollection.doc(user.uid).get().then(function(userProfile) {
        /* DELETED USER FILE */
        if(!userProfile.data()) {
          console.log(userProfile.data());
          fb.auth.signOut();
          commit('setUserProfile', {});
          router.push(`/login?error=missingUserFile&id=${user.uid}`);
          return;
        }
        
        /* KICKED! */
        if(userProfile.data().kicked) {
          console.log("KICKED USER");
          fb.auth.signOut();
          commit('setUserProfile', {});
          router.push('/login?error=kicked');
          return
        }
        // set user profile in state
        commit('setUserProfile', {...userProfile.data(), 'emailVerified': user.emailVerified, 'uid': user.uid, 'email': user.email })
        // change route to dashboard
        if (router.currentRoute.path === '/login') {
          //console.log("pushed to home")
          router.push('/resources?success=loggedIn')
        }
      }).catch(error => {
        console.error("could not write file to usersCollection", error)
        throw error
      });
    },

    async signup({ dispatch }, form) {
      // sign user up
      // const { user } = 
      let credentials = {};
      
      return fb.auth.createUserWithEmailAndPassword(form.email, form.password).then(function(user) {
         // create user profile object in userCollections
        credentials = user.user;
        return fb.usersCollection.doc(credentials.uid).set({  // return ?????
          name: form.name,
          title: form.title,
          email: form.email,
          role: 'user',
          uid: user.user.uid,
          favorites: [],
          contribution: 0,
          img: '',
          createdOn: new Date(),
          lastLogin: new Date(),
        }).then(async function() {
          // fetch user profile and set in state
          await dispatch('fetchUserProfile', credentials)
          
          // Send verification email
          store.dispatch('sendEmailVerification');

          // change route to dashboard
          if (router.currentRoute.path === '/signup') {
            //console.log("pushed to home")
            router.push('/resources?info=welcome')
          }
          return true;
        }).catch(function(error) {
          console.log("error at doc(user.uid).set", error);
          throw error;
        });
      }).catch(error => {
        console.log("error at createUserWithEmailAndPassword", error);
        throw error;
      });
    },

    sendEmailVerification() {
      console.log("Send email verification email...")
      let actionCodeSettings = {
        url: 'https://szenodb.telefabi.ch/#/resources?success=emailVerified',
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
      fb.auth.currentUser.sendEmailVerification(actionCodeSettings).then(function() {
        console.log("Verification email sent");
      }).catch(function(error) {
        console.log(error);
      });
    },

    addContribution({ state }, add) {
      let contribution = state.userProfile.contribution+add;
      fb["db"].collection("users").doc(state.userProfile.uid).update({'contribution': contribution})
      // RELOAD USER STATE
      store.commit('setUserProfile', {...state.userProfile, 'contribution': contribution })
    },

    /* RESOURCES */
    async getResources({state}, limit) {
      // Do not load deleted resources for regular user
      let query = fb["db"].collection('resources').where('flags.deleted', '==', false);
      if(state.userProfile.role === 'admin') {
        query = fb["db"].collection('resources');
      }
      query.orderBy('createdOn', 'desc').limit(limit).onSnapshot(snapshot => {
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
      // Do not load deleted resources for regular user
      let query = fb["db"].collection('resources').where('flags.deleted', '==', false);
      if(state.userProfile.role === 'admin') {
        query = fb["db"].collection('resources');
      }
      query.orderBy('createdOn', 'desc').onSnapshot(snapshot => {
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
      // Do not load deleted resources for regular user
      let query = fb["db"].collection('resources').where('flags.deleted', '==', false);
      if(state.userProfile.role === 'admin') {
        query = fb["db"].collection('resources');
      }
      query.where('userId', '==', state.userProfile.uid).orderBy('createdOn', 'desc').onSnapshot(snapshot => {
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
      fb["db"].collection('resources').where('flags.deleted', '==', true).orderBy('flags.date', 'desc').onSnapshot(snapshot => {
        let dataArray = []
        snapshot.forEach(doc => {
          let resource = doc.data()
          resource.id = doc.id
          dataArray.push(resource)
        })
        store.commit('setResource', dataArray)
      })
    },

    async addResource({ state }, {collection, post}) {  //state, commit  //
      // return if user email not verified
      if(!state.userProfile.emailVerified) throw new Error('Please verify your email address');
      // make sure to not write in not allowed collections if not admin
      if(state.userProfile.role !== 'admin' && !["resources", "posts", "texts"].includes(collection)) {
        console.error("Error writing document: Not allowed");
        // makes the dispatch command in component go "catch" as error
        throw {'message': "Error writing document: Not allowed"};
      }
      let creationDate = new Date();
      post.translations = {
        'DE': [],
        'EN-GB': [],
        'FR': [],
        'IT': [],
      }
      await fb["db"].collection(collection).add({
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
      }).then(async function(docRef) {
        store.dispatch('addContribution', 4);
        await store.dispatch('translateResource', {'document': docRef.id, 'data': post});
        await store.dispatch('buildSearchfield', {'id': docRef.id });
        // fb["db"].collection("users").doc(state.userProfile.uid).update({'contribution': state.userProfile.contribution+3})
        // store.dispatch('updateField', {'collection':'users', 'document':state.userProfile.uid, 'field':'contribution', 'data':state.userProfile.contribution+3})
        return true
      }).catch(function(error) {
        throw error;
      });
    },

    // eslint-disable-next-line no-unused-vars
    async buildSearchfield({state}, document) {
      // get document into data...
      let data = (await fb["db"].collection('resources').doc(document.id).get()).data();
      let fields = [
        data.content.title,
        data.content.name,
        data.content.resources,
        data.content.info,
        data.content.address,
        data.content.tel,
        data.content.email,
        data.content.web,
        data.content.translations["DE"][0],
        data.content.translations["DE"][1],
        data.content.translations["EN-GB"][0],
        data.content.translations["EN-GB"][1],
        data.content.translations["FR"][0],
        data.content.translations["FR"][1],
        data.content.translations["IT"][0],
        data.content.translations["IT"][1],
      ]
      fields = fields.join('').replace(/[^0-9a-zA-Z]/g, '').toLowerCase();
      // write fields to document.content.searchfield
      await fb["db"].collection('resources').doc(document.id).set({
        content: {
          searchfield: fields
        }
      }, { merge: true }).then(function() {
        return true
      }).catch(function(error) {
        throw error;
      });
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
      await fb["db"].collection(collection).doc(document).update({
        editedOn: new Date(),
        content: post,
        userIdEdited: fb.auth.currentUser.uid,
        userNameEdited: state.userProfile.name,
      }).then(async function() {
        store.dispatch('addContribution', 2);
        // if post.resources or post.info was changed:
        if(oldData.resources != post.resources || oldData.info != post.info) {
          await store.dispatch('translateResource', {'document': document, 'data': post});
        }
        await store.dispatch('buildSearchfield', {'id': document });
        // store.dispatch('updateField', {'collection':'users', 'document':state.userProfile.uid, 'field':'contribution', 'data':state.userProfile.contribution+2})
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
    async translateResource({ state }, {document, data}) {
      let targetLangs = ['DE', 'FR', 'EN-GB', 'IT'];
      let translations = {
        'DE': [], 'FR': [], 'EN-GB': [], 'IT': []
      };

      let originalLang = 'DE';
      
      for (let i = 0; i < targetLangs.length; i++) {
        let text = await store.dispatch('translate', {'text': [data.resources, data.info], 'lang': targetLangs[i]});
        for (let x = 0; x < text.length; x++) {
          // Takes only the language from the last field => .info
          if(text[x].text.length && (text[x].detected_source_language === 'EN' || targetLangs.includes(text[x].detected_source_language))) {
            originalLang = text[x].detected_source_language === 'EN' ? 'EN-GB' : text[x].detected_source_language;
          }
          translations[targetLangs[i]].push(text[x].text);
        }
      }

      let update = {
        content: {
          originalLang: originalLang,
          translations: translations,
        },
      };

      await fb["db"].collection('resources').doc(document).set(update, { merge: true }).then(function() {
        return true
      }).catch(function(error) {
        throw error;
      });
    },

    searchResources({commit, state}, payload) {
      // await new Promise(resolve => setTimeout(resolve, 3000));
      payload = payload.replace(/[^0-9a-zA-Z]/g, '').toLowerCase()
      // Firestore has not search freetext algorythm.. despite being from google.
      // Do not load deleted resources for regular user
      let query = fb["db"].collection('resources').where('flags.deleted', '==', false);
      if(state.userProfile.role === 'admin') {
        query = fb["db"].collection('resources');
      }
      query.orderBy('createdOn', 'desc').onSnapshot(snapshot => {
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
store.dispatch('getResources', 100);

export default store
