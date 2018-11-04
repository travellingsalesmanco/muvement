import { combineReducers } from 'redux';
import choreos from './choreos'
import UI from './ui'
import {
  ADD_DANCER_TO_FORMATION,
  ADD_FORMATION,
  EDIT_FORMATION_DURATION,
  MOVE_DANCER,
  REMOVE_DANCER,
  REMOVE_DANCER_FROM_FORMATION,
  REMOVE_FORMATION,
  RENAME_DANCER,
  ADD_DANCER,
  RENAME_FORMATION,
  REORDER_FORMATION,
  EDIT_FORMATION_TRANSITION,
  CLEAR_FORMATION_TRANSITION,
  USER_LOGOUT, CLEAR_FORMATION_HISTORY, REDO_FORMATION_CHANGE, UNDO_FORMATION_CHANGE,
  UPDATE_CHOREO_MUSIC,
  UPDATE_CHOREO_IMAGE,
} from '../constants/actionTypes';
import { undoableInMem } from "../lib/historyUtils";

const appReducer = combineReducers({
  choreos,
  UI
});

const FORMATION_DATA_CHANGES = [
  ADD_DANCER_TO_FORMATION,
  ADD_FORMATION,
  EDIT_FORMATION_DURATION,
  MOVE_DANCER,
  REMOVE_DANCER,
  REMOVE_DANCER_FROM_FORMATION,
  REMOVE_FORMATION,
  RENAME_DANCER,
  RENAME_FORMATION,
  REORDER_FORMATION,
  EDIT_FORMATION_TRANSITION,
  CLEAR_FORMATION_TRANSITION,
  ADD_DANCER,
  REMOVE_DANCER
];

// TODO: add additional config where necessary
const undoableAppReducer = undoableInMem(appReducer, {
  undoType: UNDO_FORMATION_CHANGE,
  redoType: REDO_FORMATION_CHANGE,
  clearHistoryType: CLEAR_FORMATION_HISTORY,
  includedTypes: [...FORMATION_DATA_CHANGES],
  resetTypes: [UPDATE_CHOREO_MUSIC, UPDATE_CHOREO_IMAGE]
});

// Root reducer
export default (state, action) => {
  if (action.type === USER_LOGOUT) {
    // On user logout, reset state to default
    state = undefined;
  }
  return undoableAppReducer(state, action)
};