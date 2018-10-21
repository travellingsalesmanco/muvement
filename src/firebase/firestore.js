import { db, auth, currentTimeStamp} from './firebase';

// Returns created dance if successful
export const createDance = (dance) => {
  // Add in creator id
  console.log(auth.currentUser);
  return db.collection("dances").add({
    ...dance,
    creator: {
      id: auth.currentUser.uid,
      name: auth.currentUser.displayName
    },
    createdAt: currentTimeStamp(),
    updatedAt: currentTimeStamp()
  }).then(docRef => {
    // Require updated
    return docRef.get({ source: "server" }).then((docSnap) => {
      return {
        id: docRef.id,
        dance: docSnap.data({ serverTimestamps: "estimate" })
      }
    })
  });
};

export const updateDance = (danceId, dance) => {
  return db.collection("dances").doc(danceId).set({
    ...dance,
    updatedAt: currentTimeStamp()
  });
};


export const deleteDance = (danceId) => {
  return db.collection("dances").doc(danceId).delete();
};
