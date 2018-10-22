import {
  ADD_DANCE,
  LOAD_DANCE,
  REMOVE_DANCE,
  ADD_DANCER,
  ADD_FORMATION,
  EDIT_STAGE_DIMENSIONS,
  REMOVE_DANCER,
  REORDER_FORMATION,
  SET_LABELS_VIEW,
  SWITCH_ACTIVE_DANCE,
  SWITCH_ACTIVE_FORMATION
} from "../constants/actionTypes";
import { defaultStageDim } from "../constants/defaults";
import { getDance } from "../selectors/dance";

function containsDancer(danceId, name, state) {
  return getDance(state, danceId).dancers.includes(name);
}

function hasFormation(danceId, formationId, state) {
  return formationId >= 0 && formationId < getDance(state, danceId).formations.length
}

function hasDance(danceId, state) {
  return getDance(state, danceId) !== undefined;
}

function ownsDance(danceId, state) {
  return state.dances.myDances.includes(danceId);
}

function getLostDances(dances, state) {
  return state.dances.myDances.filter((danceId) => dances.every((dance) => dance.id !== danceId))
}

function isNewer(dance, danceId, state) {
  const currDance = getDance(state, danceId);
  // TODO: remove dummy check when deploy
  return currDance.updatedAt !== "timestamp2"
    ? currDance.updatedAt.seconds < dance.updatedAt.seconds
    : true;
}

export function addDance(id, dance) {
  return (dispatch) => {
    dispatch({
      type: ADD_DANCE,
      payload: {
        danceId: id,
        dance: dance
      }
    });
    dispatch({
      type: SWITCH_ACTIVE_DANCE,
      payload: id
    });
  }
}

export function updateDanceIfNewer(id, dance) {
  return (dispatch, getState) => {
    if (isNewer(dance, id, getState())) {
      dispatch({
        type: LOAD_DANCE,
        payload: {
          danceId: id,
          dance: dance
        }
      });
    }
  }
}

export function syncCreatorDances(dances) {
  return (dispatch, getState) => {
    // Remove dances no longer tagged under creator in cloud
    let lostDances = getLostDances(dances, getState());
    lostDances.forEach((danceId) => {
      dispatch({
        type: REMOVE_DANCE,
        payload: danceId
      })
    });
    dances.forEach((dance) => {
      if (!hasDance(dance.id, getState())) {
        // Add dances not on local
        console.log("ADDING");
        dispatch({
          type: ADD_DANCE,
          payload: {
            danceId: dance.id,
            dance: dance.data
          }
        });
      } else if (isNewer(dance.data, dance.id, getState())) {
        // Update existing dances if newer
        dispatch({
          type: LOAD_DANCE,
          payload: {
            danceId: dance.id,
            dance: dance.data
          }
        });
      }
    });
  }
}

export function addDancers(danceId, names) {
  return (dispatch, getState) => {
    names.forEach((name) => {
      if (!containsDancer(danceId, name, getState())) {
        dispatch({
          type: ADD_DANCER,
          danceId: danceId,
          payload: name
        })
      } else {
        console.log("[ERROR] Duplicate dancer name")
      }
    });
  }
}

export function removeDancers(danceId, names) {
  return (dispatch, getState) => {
    names.forEach((name) => {
      if (containsDancer(danceId, name, getState())) {
        dispatch({
          type: REMOVE_DANCER,
          danceId: danceId,
          payload: name
        })
      } else {
        console.log("[ERROR] Dancer does not exist")
      }
    });
  }
}

export function editStageDimensions(danceId, toEdit) {
  return dispatch => {
    if ((toEdit.width && toEdit.width <= 0)
      || (toEdit.height && toEdit.height <= 0)
      || (toEdit.gridSize && toEdit.gridSize < 0)) {
      console.log("[ERROR] Dimensions must be greater than 0")
    } else {
      dispatch({
        type: EDIT_STAGE_DIMENSIONS,
        danceId: danceId,
        payload: toEdit
      })
    }
  }
}

export function addAndSetActiveFormation(danceId, formationId) {
  return dispatch => {
    if (formationId < 0) {
      console.log("[ERROR] Index cannot be negative")
    } else {
      dispatch({
        type: ADD_FORMATION,
        danceId: danceId,
        payload: formationId
      });
      dispatch({
        type: SWITCH_ACTIVE_FORMATION,
        payload: formationId
      })
    }
  }
}

export function gotoFormation(danceId, targetFormationId) {
  return (dispatch, getState) => {
    // checks if formation is correct
    if (!hasFormation(danceId, targetFormationId, getState())) {
      console.log("[ERROR] Index out of bounds")
    } else {
      dispatch({
        type: SWITCH_ACTIVE_FORMATION,
        payload: targetFormationId
      })
    }
  }
}

export function toggleLabels() {
  return (dispatch, getState) => {
    console.log("TOGGLE");
    dispatch({
      type: SET_LABELS_VIEW,
      payload: !getState().UI.showLabels
    })
  }
}

export function reorderAndFocusFormation(danceId, fromIndex, toIndex) {
  return (dispatch, getState) => {
    if (hasFormation(danceId, fromIndex, getState()) && hasFormation(danceId, toIndex, getState())) {
      dispatch({
        type: REORDER_FORMATION,
        danceId: danceId,
        payload: {
          fromIndex: fromIndex,
          toIndex: toIndex
        }
      })
      dispatch({
        type: SWITCH_ACTIVE_FORMATION,
        payload: toIndex
      })
    } else {
      console.log("[ERROR] Index out of bounds")
    }
  }
}