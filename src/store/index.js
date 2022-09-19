import Vue from 'vue'
import Vuex from 'vuex'
import * as fb from '../firebase'
import router from '../router/index'

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
    // eslint-disable-next-line no-unused-vars
    async getResources({commit}, limit) {
      fb["db"].collection('resources').orderBy('createdOn', 'desc').limit(limit).onSnapshot(snapshot => {
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
      fb["db"].collection('resources').orderBy('createdOn', 'desc').onSnapshot(snapshot => {
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
      fb["db"].collection('resources').where('userId', '==', state.userProfile.uid).orderBy('createdOn', 'desc').onSnapshot(snapshot => {
        let dataArray = []
        snapshot.forEach(doc => {
          let resource = doc.data()
          resource.id = doc.id
          dataArray.push(resource)
        })
        store.commit('setResource', dataArray)
      })
    },

    async showMarkedForDeletion() {
      fb["db"].collection('resources').where('markedForDeletion.status', '==', true).orderBy('markedForDeletion.date', 'desc').onSnapshot(snapshot => {
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
      await fb["db"].collection(collection).add({
        createdOn: creationDate,
        editedOn: creationDate,
        content: post,
        userId: fb.auth.currentUser.uid,
        userName: state.userProfile.name,
        markedForDeletion: {
          status: false,
        }
      }).then(function() {
        store.dispatch('addContribution', 4);
        // fb["db"].collection("users").doc(state.userProfile.uid).update({'contribution': state.userProfile.contribution+3})
        // store.dispatch('updateField', {'collection':'users', 'document':state.userProfile.uid, 'field':'contribution', 'data':state.userProfile.contribution+3})
        return true
      }).catch(function(error) {
        throw error;
      });
    },

    async editResource({ state }, {collection, document, post}) {
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
        userId: fb.auth.currentUser.uid,
        userName: state.userProfile.name,
      }).then(function() {
        store.dispatch('addContribution', 2);
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

    searchResources({commit}, payload) {
      // await new Promise(resolve => setTimeout(resolve, 3000));
      payload = payload.replace(/[^0-9a-zA-Z]/g, '').toLowerCase()
      // Firestore has not search freetext algorythm.. despite being from google.
      fb["db"].collection('resources').orderBy('createdOn', 'desc').onSnapshot(snapshot => {
        let dataArray = []
        let primaryDataArray = []
        snapshot.forEach(doc => {
          let resource = doc.data()
          resource.id = doc.id
          if(!payload) {
            // if no search, display results
            dataArray.push(resource)
          } else if(payload && resource.content.searchfield.indexOf(payload) === 0)  {
            // find exact matches in the title. searchfield has the title first, so position is 0 if title is exact.
            resource.primaryResult=true;
            primaryDataArray.push(resource)
          } else if(payload && resource.content.searchfield.indexOf(payload) !== -1)  {
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
