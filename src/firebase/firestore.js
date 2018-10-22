import { db, auth, currentTimeStampField } from './firebase';

// Returns created choreo if successful
export const createChoreo = (choreo) => {
  // Add in creator id
  return db.collection("choreos").add({
    ...choreo,
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
        data: docSnap.data({ serverTimestamps: "estimate" })
      }
    })
  });
};

export const getChoreo = (choreoId) => {
  return db.collection("choreos").doc(choreoId).get({ source: "server" }).then((docSnap) => {
    return docSnap.data({ serverTimestamps: "estimate" });
  })
};

export const getCreatorChoreos = () => {
  return db.collection("choreos").where("creator.id", "==", auth.currentUser.uid).get({ source: "server" })
    .then((querySnap) => {
      return querySnap.docs.map(docSnap => {
        return {
          id: docSnap.id,
          data: docSnap.data({ serverTimestamps: "estimate" })
        }
      });
    });
};

export const updateChoreo = (choreoId, choreo) => {
  return db.collection("choreos").doc(choreoId).set({
    ...choreo,
    updatedAt: currentTimeStampField()
  });
};


export const deleteChoreo = (choreoId) => {
  return db.collection("choreos").doc(choreoId).delete();
};
