import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'
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
firebase.initializeApp(firebaseConfig)

// utils
const db = firebase.firestore()
const auth = firebase.auth()
const storage = firebase.storage()

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