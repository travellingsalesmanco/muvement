import {
  RENAME_DANCE,
  PUBLISH_DANCE,
  UNPUBLISH_DANCE,
  EDIT_STAGE_DIMENSIONS,
  ADD_FRAME,
  REMOVE_FRAME,
  RENAME_FRAME,
  REORDER_FRAME,
  EDIT_FRAME_DURATION,
  ADD_DANCER,
  REMOVE_DANCER,
  RENAME_DANCER,
  ADD_DANCER_TO_FRAME,
  REMOVE_DANCER_FROM_FRAME,
  MOVE_DANCER
} from "../constants/actionTypes";
import { firestore } from "../firebase";

const ACTIONS_TO_UPDATE = [
  RENAME_DANCE,
  PUBLISH_DANCE,
  UNPUBLISH_DANCE,
  EDIT_STAGE_DIMENSIONS,
  ADD_FRAME,
  REMOVE_FRAME,
  RENAME_FRAME,
  REORDER_FRAME,
  EDIT_FRAME_DURATION,
  ADD_DANCER,
  REMOVE_DANCER,
  RENAME_DANCER,
  ADD_DANCER_TO_FRAME,
  REMOVE_DANCER_FROM_FRAME,
  MOVE_DANCER
];

export const firestoreWriter = store => next => action => {
  let result = next(action);
  if (ACTIONS_TO_UPDATE.includes(action.type)) {
    const danceId = action.danceId;
    const updatedDance = store.getState().dances.byId[danceId];
    console.log("Updating: " + action.type + " for " + danceId);
    console.log("New dance: ");
    console.log(updatedDance);
    // TODO: rate-limiting (debouncing)
    firestore.updateDance(danceId, updatedDance);
  }
  return result
};