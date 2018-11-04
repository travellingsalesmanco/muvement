import {
  ADD_CHOREO,
  ADD_DANCER,
  ADD_DANCER_TO_FORMATION,
  ADD_FORMATION,
  EDIT_FORMATION_DURATION,
  EDIT_FORMATION_TRANSITION,
  EDIT_STAGE_DIMENSIONS,
  MOVE_DANCER,
  PUBLISH_CHOREO,
  REDO_FORMATION_CHANGE,
  REMOVE_CHOREO,
  REMOVE_DANCER,
  REMOVE_DANCER_FROM_FORMATION,
  REMOVE_FORMATION,
  RENAME_CHOREO,
  RENAME_DANCER,
  RENAME_FORMATION,
  REORDER_FORMATION,
  UNDO_FORMATION_CHANGE,
  UNPUBLISH_CHOREO,
  UPDATE_CHOREO_IMAGE,
  UPDATE_CHOREO_MUSIC,
  USER_LOGOUT
} from "../constants/actionTypes";
import { firestore } from "../firebase";
import { doSignOut } from "../firebase/auth";
import { deleteChoreo } from "../firebase/firestore";
import { removeChoreoImage } from "../firebase/storage";

const ACTIONS_TO_UPDATE = [
  RENAME_CHOREO,
  PUBLISH_CHOREO,
  UNPUBLISH_CHOREO,
  UPDATE_CHOREO_IMAGE,
  UPDATE_CHOREO_MUSIC,
  EDIT_STAGE_DIMENSIONS,
  ADD_FORMATION,
  REMOVE_FORMATION,
  RENAME_FORMATION,
  REORDER_FORMATION,
  EDIT_FORMATION_DURATION,
  EDIT_FORMATION_TRANSITION,
  ADD_DANCER,
  REMOVE_DANCER,
  RENAME_DANCER,
  ADD_DANCER_TO_FORMATION,
  REMOVE_DANCER_FROM_FORMATION,
  MOVE_DANCER,
  UNDO_FORMATION_CHANGE,
  REDO_FORMATION_CHANGE
];

let choreosToUpdate = {}
const updateFireStoreDebounced = (choreoId, newChoreo) => {
  // If there's a queued update for the same choreo, skip incoming update
  if (choreosToUpdate[choreoId] !== newChoreo) {
    choreosToUpdate[choreoId] = newChoreo
    setTimeout(() => {
      // If store and newChoreo no longer match, then there's a newer update queued
      if (choreosToUpdate[choreoId] === newChoreo) {
        console.log("Updating firestore with wew choreo: ", newChoreo);
        choreosToUpdate[choreoId] = undefined
        firestore.updateChoreo(choreoId, newChoreo);
      }
    }, 500)
  }
}

export const firestoreWriter = store => next => action => {

  switch (action.type) {
    case USER_LOGOUT: {
      return doSignOut().then(() => next(action));
    }
    case REMOVE_CHOREO: {
      if (!action.stale) {
        // Remove choreo from firestore (not internal change)
        deleteChoreo(action.choreoId);
        if (action.removeImage) {
          removeChoreoImage(action.choreoId);
        }
      }
      return next(action);
    }
    case ADD_CHOREO: {
      if (action.choreoId) {
        // Internal update of state
        return next(action);
      } else {
        // Create new choreo on firestore
        let newChoreo = action.payload;
        return firestore.createChoreo(newChoreo).then(createdChoreo => {
          return next({
            ...action,
            payload: createdChoreo.data,
            choreoId: createdChoreo.id
          });
        });
      }
    }
    default: {
      const choreoId = action.choreoId;
      const oldChoreo = store.getState().choreos.byId[choreoId];
      let result = next(action);
      if (ACTIONS_TO_UPDATE.includes(action.type)) {
        const updatedChoreo = store.getState().choreos.byId[choreoId];
        updateFireStoreDebounced(choreoId, updatedChoreo);
      }
      return result
    }
  }
};