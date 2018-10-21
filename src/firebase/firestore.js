import { db, auth, currentTimeStampField } from './firebase';

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
    createdAt: currentTimeStampField(),
    updatedAt: currentTimeStampField()
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

export const getDance = (danceId) => {
  return db.collection("dances").doc(danceId).get({ source: "server" }).then((docSnap) => {
    return docSnap.data({ serverTimestamps: "estimate" });
  })
};

export const getCreatorDances = () => {
  return db.collection("dances").where("creator.id", "==", auth.currentUser.uid).get({ source: "server" })
    .then((querySnap) => {
      return querySnap.docs.map(docSnap => {
        return {
          id: docSnap.id,
          dance: docSnap.data({ serverTimestamps: "estimate" })
        }
      });
    });
};

export const updateDance = (danceId, dance) => {
  return db.collection("dances").doc(danceId).set({
    ...dance,
    updatedAt: currentTimeStampField()
  });
};


export const deleteDance = (danceId) => {
  return db.collection("dances").doc(danceId).delete();
};
