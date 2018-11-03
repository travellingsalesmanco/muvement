import { storageRef } from "./firebase";

const choreoImagesRef = storageRef.child('choreoImages');

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
