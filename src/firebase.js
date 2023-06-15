// import * as firebase from 'firebase/app'
import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/firestore'
import 'firebase/compat/storage'
/* import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore/lite';
import { authentication } from 'firebase/auth';
import { storage } from 'firebase/storage'; */

import { authKeys } from './auth.js'

// firebase init - add your own config here
const firebaseConfig = {
  apiKey: authKeys.fb.apiKey,
  authDomain: "szenodb.firebaseapp.com",
  //databaseURL: "https://szenodb.firebaseio.com",
  projectId: "szenodb",
  storageBucket: authKeys.fb.storageBucket,
  messagingSenderId: authKeys.fb.messagingSenderId,
  appId: authKeys.fb.appId,
  measurementId: authKeys.fb.measurementId
};
// FIXME
firebase.initializeApp(firebaseConfig)

// utils
const db = firebase.firestore()
const auth = firebase.auth()
const storage = firebase.storage()
/* const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = authentication(app);
const storageThing = storage(app); */

// collection references
const usersCollection = db.collection('users')
const postsCollection = db.collection('posts')
const commentsCollection = db.collection('comments')
const likesCollection = db.collection('likes')

// export utils/refs
export {
  db,
  auth,
  storage,
  usersCollection,
  postsCollection,
  commentsCollection,
  likesCollection
}