import { auth, facebookProvider, googleProvider } from './firebase';

// TODO: handle multiple credentials

export const doSignOut = () => {
  return auth.signOut();
};

// Email and Password Methods
export const doCreateUserWithEmailAndPassword = (email, password) => {
  return auth.createUserWithEmailAndPassword(email, password);
};

export const doSignInWithEmailAndPassword = (email, password) => {
  return auth.signInWithEmailAndPassword(email, password);
};

export const doPasswordReset = (email) => {
  return auth.sendPasswordResetEmail(email);
};

export const doPasswordUpdate = (password) => {
  return auth.currentUser.updatePassword(password);
};


// Google Methods

export const googleSignIn = () => {
  return auth.signInWithPopup(googleProvider);
};

// Facebook Methods

export const facebookSignIn = () => {
  return auth.signInWithPopup(facebookProvider);
};