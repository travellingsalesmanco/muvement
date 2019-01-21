import {
  auth,
  facebookProvider,
  googleProvider,
  constants
} from './firebase';
import { Mixpanel } from '../mixpanel';


// TODO: handle multiple credentials

function AuthException(code, method) {
  this.code = code;
  this.method = method;
}

export const doSignOut = () => {
  return auth.signOut();
};

// Email and Password Methods
export const doSignUpWithEmailAndPassword = (displayName, email, password) => {
  const { EMAIL_SIGN_UP, EMAIL_SIGN_IN_METHOD } = constants;
  return auth.createUserWithEmailAndPassword(email, password).then((userCred) => {
    Mixpanel.alias(userCred.user.uid);
    Mixpanel.track('New User With Email', {'user': userCred.user.uid});
    return userCred.user.updateProfile({
      displayName: displayName,
      photoURL: null
    });
  }).catch((err) => {
    // Reform error to auth errors
    if (err.code === EMAIL_SIGN_UP.EMAIL_EXISTS_CODE) {
      return auth.fetchSignInMethodsForEmail(email).then((methods) => {
        let userMethod = methods[0];
        if (userMethod === EMAIL_SIGN_IN_METHOD) {
          throw new AuthException(err.code);
        } else {
          // User method is either FACEBOOK_SIGN_IN_METHOD or GOOGLE_SIGN_IN_METHOD from constants
          throw new AuthException(EMAIL_SIGN_UP.DIFFERENT_PROVIDER_CODE, userMethod);
        }
      })
    } else {
      throw new AuthException(err.code);
    }
  });
};

export const doSignInWithEmailAndPassword = (email, password) => {
  const { EMAIL_SIGN_IN, EMAIL_SIGN_IN_METHOD } = constants;
  return auth.signInWithEmailAndPassword(email, password).then((userCred) => {
    Mixpanel.identify(userCred.user.uid);
    Mixpanel.track('User Log In Email', {'user': userCred.user.uid});
  }).catch((err) => {
    // Reform error to auth errors
    if (err.code === EMAIL_SIGN_IN.WRONG_PASSWORD_CODE) {
      return auth.fetchSignInMethodsForEmail(email).then((methods) => {
        let userMethod = methods[0];
        if (userMethod === EMAIL_SIGN_IN_METHOD) {
          throw new AuthException(err.code);
        } else {
          // User method is either FACEBOOK_SIGN_IN_METHOD or GOOGLE_SIGN_IN_METHOD from constants
          throw new AuthException(EMAIL_SIGN_IN.WRONG_PROVIDER_CODE, userMethod);
        }
      })
    } else {
      throw new AuthException(err.code);
    }
  });
};

export const doPasswordReset = (email) => {
  return auth.sendPasswordResetEmail(email);
};

export const doPasswordResetInAccount = () => {
  return auth.sendPasswordResetEmail(auth.currentUser.email);
};

export const doPasswordUpdate = (password) => {
  return auth.currentUser.updatePassword(password);
};


// Google Methods

export const googleSignIn = () => {
  const { PROVIDER } = constants;
  return auth.signInWithPopup(googleProvider).then((userCred) => {
    Mixpanel.identify(userCred.user.uid);
    Mixpanel.track('User Log In Google', {'user': userCred.user.uid});
  }).catch((err) => {
    // Reform error to auth errors
    if (err.code === PROVIDER.ACCOUNT_EXISTS_CODE) {
      let userEmail = err.email;
      return auth.fetchSignInMethodsForEmail(userEmail).then((methods) => {
        let userMethod = methods[0];
        // User method is either FACEBOOK_SIGN_IN_METHOD or EMAIL_SIGN_IN_METHOD from constants
        throw new AuthException(PROVIDER.ACCOUNT_EXISTS_CODE, userMethod);
      })
    } else {
      throw new AuthException(err.code);
    }
  });
};

// Facebook Methods

export const facebookSignIn = () => {
  const { PROVIDER } = constants;
  return auth.signInWithPopup(facebookProvider).then((userCred) => {
    Mixpanel.identify(userCred.user.uid);
    Mixpanel.track('User Log In Facebook', {'user': userCred.user.uid});
  }).catch((err) => {
    // Reform error to auth errors
    if (err.code === PROVIDER.ACCOUNT_EXISTS_CODE) {
      let userEmail = err.email;
      return auth.fetchSignInMethodsForEmail(userEmail).then((methods) => {
        let userMethod = methods[0];
        // User method is either GOOGLE_SIGN_IN_METHOD or EMAIL_SIGN_IN_METHOD from constants
        throw new AuthException(PROVIDER.ACCOUNT_EXISTS_CODE, userMethod);
      })
    } else {
      throw new AuthException(err.code);
    }
  });
};