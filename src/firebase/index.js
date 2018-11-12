import * as auth from './auth';
import * as firestore from './firestore';
import * as storage from './storage';
import { constants as firebaseConstants, auth as authInstance, currentTimeStamp } from './firebase';

export {
  auth,
  firestore,
  storage,
  firebaseConstants,
  authInstance,
  currentTimeStamp
}