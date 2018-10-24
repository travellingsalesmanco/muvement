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
  MOVE_DANCER
} from "../constants/actionTypes";
import { firestore } from "../firebase";

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
  MOVE_DANCER
];

export const firestoreWriter = store => next => action => {
  let result = next(action);
  if (ACTIONS_TO_UPDATE.includes(action.type)) {
    const choreoId = action.choreoId ? action.choreoId : action.payload.choreoId;
    const updatedChoreo = store.getState().choreos.byId[choreoId];
    console.log("Updating: " + action.type + " for " + choreoId);
    console.log("New choreo: ");
    console.log(updatedChoreo);
    // TODO: rate-limiting (debouncing)
    firestore.updateChoreo(choreoId, updatedChoreo);
  }
  return result
};