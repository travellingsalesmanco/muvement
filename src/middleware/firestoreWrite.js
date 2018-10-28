import {
  RENAME_CHOREO,
  PUBLISH_CHOREO,
  UNPUBLISH_CHOREO,
  UPDATE_CHOREO_IMAGE,
  EDIT_STAGE_DIMENSIONS,
  ADD_FORMATION,
  REMOVE_FORMATION,
  RENAME_FORMATION,
  REORDER_FORMATION,
  EDIT_FORMATION_DURATION,
  ADD_DANCER,
  REMOVE_DANCER,
  RENAME_DANCER,
  ADD_DANCER_TO_FORMATION,
  REMOVE_DANCER_FROM_FORMATION,
  MOVE_DANCER,
  USER_LOGOUT,
  ADD_CHOREO,
  REMOVE_CHOREO,
  UNDO_FORMATION_CHANGE,
  REDO_FORMATION_CHANGE
} from "../constants/actionTypes";
import { firestore } from "../firebase";
import { doSignOut } from "../firebase/auth";
import { deleteChoreo } from "../firebase/firestore";
import { defaultStageDim, genDummyImage } from "../constants/defaults";
import { removeChoreoImage } from "../firebase/storage";

const ACTIONS_TO_UPDATE = [
  RENAME_CHOREO,
  PUBLISH_CHOREO,
  UNPUBLISH_CHOREO,
  UPDATE_CHOREO_IMAGE,
  EDIT_STAGE_DIMENSIONS,
  ADD_FORMATION,
  REMOVE_FORMATION,
  RENAME_FORMATION,
  REORDER_FORMATION,
  EDIT_FORMATION_DURATION,
  ADD_DANCER,
  REMOVE_DANCER,
  RENAME_DANCER,
  ADD_DANCER_TO_FORMATION,
  REMOVE_DANCER_FROM_FORMATION,
  MOVE_DANCER,
  UNDO_FORMATION_CHANGE,
  REDO_FORMATION_CHANGE
];

export const firestoreWriter = store => next => action => {

  switch (action.type) {
    case USER_LOGOUT: {
      return doSignOut().then(() => next(action));
    }
    case REMOVE_CHOREO: {
      if (!action.stale) {
        // Remove choreo from firestore (not internal change)
        deleteChoreo(action.choreoId);
        removeChoreoImage(action.choreoId);
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
        console.log("Updating: " + action.type + " for " + choreoId);
        console.log("Old choreo: ");
        console.log(oldChoreo);
        console.log("New choreo: ");
        console.log(updatedChoreo);
        // TODO: proper deep comparison
        console.log("Is same: ");
        console.log(JSON.stringify(oldChoreo) === JSON.stringify(updatedChoreo));
        // TODO: rate-limiting (debouncing)
        firestore.updateChoreo(choreoId, updatedChoreo);
      }
      return result
    }
  }
};