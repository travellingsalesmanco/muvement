import { storageRef } from "./firebase";

const choreoImagesRef = storageRef.child('choreoImages');
const choreoMusicRef = storageRef.child('choreoMusic');

// Returns url for reference if successful
export const addChoreoImage = (file, choreoId) => {
  let imageRef = choreoImagesRef.child(choreoId + ".jpg");
  return imageRef.put(file).then((snapshot) => {
    return snapshot.ref.getDownloadURL();
  })
};

export const removeChoreoImage = (choreoId) => {
  let imageRef = choreoImagesRef.child(choreoId + ".jpg");
  return imageRef.delete();
};


// TODO: Check if media encoding is needed
// Returns url for reference if successful
export const addChoreoMusic = (file, choreoId) => {
  let musicRef = choreoMusicRef.child(choreoId);
  return musicRef.put(file).then((snapshot) => {
    return snapshot.ref.getDownloadURL();
  })
};

export const removeChoreoMusic = (choreoId) => {
  let musicRef = choreoMusicRef.child(choreoId);
  return musicRef.delete();
};

