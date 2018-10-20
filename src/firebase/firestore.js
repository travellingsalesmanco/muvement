import { db, auth } from './firebase';

// Returns docRef if successful
export const createDance = (dance) => {
  // Add in creator id
  return db.collection("dances").add({
    ...dance,
    creator: {
      id: auth.currentUser.uid,
      name: auth.currentUser.displayName
    },
    createdAt: db.FieldValue.serverTimestamp(),
    updatedAt: db.FieldValue.serverTimestamp()
  });
};

export const updateDance = (danceId, dance) => {
  return db.collection("dances").doc(danceId).set({
    ...dance,
    updatedAt: db.FieldValue.serverTimestamp()
  });
};


export const deleteDance = (danceId) => {
  return db.collection("dances").doc(danceId).delete();
};
