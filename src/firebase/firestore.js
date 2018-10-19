import { db, auth } from './firebase';

// Returns docRef if successful
export const createDance = (dance) => {
  // Add in creator id
  return db.collection("dances").add({
    ...dance,
    creator: auth.currentUser.uid,
    timestamp: db.FieldValue.serverTimestamp()
  });
};

export const updateDance = (danceId, dance) => {
  return db.collection("dances").doc(danceId).set({
    ...dance,
    timestamp: db.FieldValue.serverTimestamp()
  });
};


export const deleteDance = (danceId) => {
  return db.collection("dances").doc(danceId).delete();
};
