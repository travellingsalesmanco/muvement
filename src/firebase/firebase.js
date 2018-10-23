import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/storage';
import 'firebase/firestore';

let config = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID
};

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

// Create firebase service instances
const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();
const storageRef = storage.ref();

// Create Providers
const googleProvider = new firebase.auth.GoogleAuthProvider();
const facebookProvider = new firebase.auth.FacebookAuthProvider();
const FACEBOOK_SIGN_IN_METHOD = firebase.auth.FacebookAuthProvider.FACEBOOK_SIGN_IN_METHOD;
const GOOGLE_SIGN_IN_METHOD = firebase.auth.GoogleAuthProvider.GOOGLE_SIGN_IN_METHOD;

// Additional configs
auth.useDeviceLanguage();
db.settings({timestampsInSnapshots: true});

// Timestamp methods
const currentTimeStampField = () => {
  return firebase.firestore.FieldValue.serverTimestamp();
};

const currentTimeStamp = () => {
  return firebase.firestore.Timestamp.now();
};

export {
  db,
  auth,
  googleProvider,
  facebookProvider,
  FACEBOOK_SIGN_IN_METHOD,
  GOOGLE_SIGN_IN_METHOD,
  currentTimeStampField,
  currentTimeStamp,
  storageRef
};