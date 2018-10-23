import { storageRef } from "./firebase";

const choreoImagesRef = storageRef.child('choreoImages');

// Returns url for reference if successful
export const addChoreoImage = (file, danceId) => {
  let imageRef = choreoImagesRef.child(danceId + ".jpg");
  return imageRef.put(file).then((snapshot) => {
    return snapshot.ref.getDownloadURL();
  })
};
