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
  RENAME_FORMATION,
  REORDER_FORMATION,
  EDIT_FORMATION_TRANSITION,
  CLEAR_FORMATION_TRANSITION,
  SWITCH_ACTIVE_FORMATION,
  USER_LOGOUT, CLEAR_FORMATION_HISTORY, REDO_FORMATION_CHANGE, UNDO_FORMATION_CHANGE
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
];

const FORMATION_UI_CHANGES = [
  SWITCH_ACTIVE_FORMATION
];

// TODO: add additional config where necessary
const undoableAppReducer = undoableInMem(appReducer, {
  undoType: UNDO_FORMATION_CHANGE,
  redoType: REDO_FORMATION_CHANGE,
  clearHistoryType: CLEAR_FORMATION_HISTORY,
  includedTypes: [...FORMATION_DATA_CHANGES, ...FORMATION_UI_CHANGES]
});

// Root reducer
export default (state, action) => {
  if (action.type === USER_LOGOUT) {
    // On user logout, reset state to default
    state = undefined;
  }
  return undoableAppReducer(state, action)
};