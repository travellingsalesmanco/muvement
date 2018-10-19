import { db, auth } from './firebase';

// Returns docRef if successful
export const createDance = (dance) => {
  // Add in creator id
  return db.collection("dances").add({
    ...dance,
    creator: auth.currentUser.uid
  })
};

export const updateDance = (danceId, dance) => {
  return db.collection("dances").doc(danceId).set(dance);
};


export const deleteDance = (danceId) => {
  return db.collection("dances").doc(danceId).delete();
};
