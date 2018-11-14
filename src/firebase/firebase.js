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

// Additional configs
auth.useDeviceLanguage();
db.settings({ timestampsInSnapshots: true });

// Timestamp methods
const currentTimeStampField = () => {
  return firebase.firestore.FieldValue.serverTimestamp();
};

const currentTimeStamp = () => {
  return firebase.firestore.Timestamp.now();
};

const buildTimeStamp = (seconds, nanoseconds) => {
  return new firebase.firestore.Timestamp(seconds, nanoseconds);
};

// Define consts for internal and external use
const constants = {
  FACEBOOK_SIGN_IN_METHOD: firebase.auth.FacebookAuthProvider.FACEBOOK_SIGN_IN_METHOD,
  GOOGLE_SIGN_IN_METHOD: firebase.auth.GoogleAuthProvider.GOOGLE_SIGN_IN_METHOD,
  EMAIL_SIGN_IN_METHOD: firebase.auth.EmailAuthProvider.EMAIL_PASSWORD_SIGN_IN_METHOD,
  EMAIL_SIGN_IN: {
    NO_USER_FOUND_CODE: "auth/user-not-found",
    WRONG_PASSWORD_CODE: "auth/wrong-password",
    INVALID_EMAIL_CODE: "auth/invalid-email",
    USER_DISABLED_CODE: "auth/user-disabled",
    // custom code
    WRONG_PROVIDER_CODE: "WRONG_PROVIDER_CODE",
  },
  EMAIL_SIGN_UP: {
    EMAIL_EXISTS_CODE: "auth/email-already-in-use",
    WEAK_PASSWORD_CODE: "auth/weak-password",
    INVALID_EMAIL_CODE: "auth/invalid-email",
    // custom code
    DIFFERENT_PROVIDER_CODE: "DIFFERENT_PROVIDER_CODE",
  },
  PROVIDER: {
    ACCOUNT_EXISTS_CODE: "auth/account-exists-with-different-credential"
  }
};


export {
  db,
  auth,
  googleProvider,
  facebookProvider,
  constants,
  currentTimeStampField,
  currentTimeStamp,
  buildTimeStamp,
  storageRef
};