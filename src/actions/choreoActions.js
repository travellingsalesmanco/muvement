import {
  ADD_CHOREO,
  LOAD_CHOREO,
  REMOVE_CHOREO,
  UPDATE_CHOREO_IMAGE,
  ADD_DANCER,
  ADD_FORMATION,
  EDIT_STAGE_DIMENSIONS,
  REMOVE_DANCER,
  REORDER_FORMATION,
  SET_LABELS_VIEW,
  SWITCH_ACTIVE_CHOREO,
  SWITCH_ACTIVE_FORMATION,
  REMOVE_FORMATION
} from "../constants/actionTypes";
import { defaultStageDim } from "../constants/defaults";
import { getChoreo } from "../selectors/choreo";

function containsDancer(choreoId, name, state) {
  return getChoreo(state, choreoId).dancers.includes(name);
}

function hasFormation(choreoId, formationId, state) {
  return formationId >= 0 && formationId < getChoreo(state, choreoId).formations.length
}

function getNumFormations(choreoId, state) {
  return getChoreo(state, choreoId).formations.length;
}

function getActiveFormation(state) {
  return state.UI.activeFormation;
}

function hasChoreo(choreoId, state) {
  return getChoreo(state, choreoId) !== undefined;
}

function ownsChoreo(choreoId, state) {
  return state.choreos.myChoreos.includes(choreoId);
}

function getLostChoreos(choreos, state) {
  return state.choreos.myChoreos.filter((choreoId) => choreos.every((choreo) => choreo.id !== choreoId))
}

function isNewer(choreo, choreoId, state) {
  const currChoreo = getChoreo(state, choreoId);
  // TODO: remove dummy check when deploy
  return currChoreo.updatedAt !== "timestamp2"
    ? currChoreo.updatedAt.seconds < choreo.updatedAt.seconds
    : true;
}

export function addChoreo(id, choreo) {
  return (dispatch) => {
    dispatch({
      type: ADD_CHOREO,
      payload: {
        choreoId: id,
        choreo: choreo
      }
    });
    dispatch({
      type: SWITCH_ACTIVE_CHOREO,
      payload: id
    });
  }
}

export function updateChoreoImage(id, link) {
  return (dispatch) => {
    dispatch({
      type: UPDATE_CHOREO_IMAGE,
      payload: {
        choreoId: id,
        link: link
      }
    })
  }
}

export function updateChoreoIfNewer(id, choreo) {
  return (dispatch, getState) => {
    if (isNewer(choreo, id, getState())) {
      dispatch({
        type: LOAD_CHOREO,
        payload: {
          choreoId: id,
          choreo: choreo
        }
      });
    }
  }
}

export function syncCreatorChoreos(choreos) {
  return (dispatch, getState) => {
    // Remove choreos no longer tagged under creator in cloud
    let lostChoreos = getLostChoreos(choreos, getState());
    lostChoreos.forEach((choreoId) => {
      dispatch({
        type: REMOVE_CHOREO,
        payload: choreoId
      })
    });
    choreos.forEach((choreo) => {
      if (!hasChoreo(choreo.id, getState())) {
        // Add choreos not on local
        console.log("ADDING");
        dispatch({
          type: ADD_CHOREO,
          payload: {
            choreoId: choreo.id,
            choreo: choreo.data
          }
        });
      } else if (isNewer(choreo.data, choreo.id, getState())) {
        // Update existing choreos if newer
        dispatch({
          type: LOAD_CHOREO,
          payload: {
            choreoId: choreo.id,
            choreo: choreo.data
          }
        });
      }
    });
  }
}

export function addDancers(choreoId, names) {
  return (dispatch, getState) => {
    names.forEach((name) => {
      if (!containsDancer(choreoId, name, getState())) {
        dispatch({
          type: ADD_DANCER,
          choreoId: choreoId,
          payload: name
        })
      } else {
        console.log("[ERROR] Duplicate dancer name")
      }
    });
  }
}

export function removeDancers(choreoId, names) {
  return (dispatch, getState) => {
    names.forEach((name) => {
      if (containsDancer(choreoId, name, getState())) {
        dispatch({
          type: REMOVE_DANCER,
          choreoId: choreoId,
          payload: name
        })
      } else {
        console.log("[ERROR] Dancer does not exist")
      }
    });
  }
}

export function editStageDimensions(choreoId, toEdit) {
  return dispatch => {
    if ((toEdit.width && toEdit.width <= 0)
      || (toEdit.height && toEdit.height <= 0)
      || (toEdit.gridSize && toEdit.gridSize < 0)) {
      console.log("[ERROR] Dimensions must be greater than 0")
    } else {
      dispatch({
        type: EDIT_STAGE_DIMENSIONS,
        choreoId: choreoId,
        payload: toEdit
      })
    }
  }
}

export function addAndSetActiveFormation(choreoId, formationId) {
  return dispatch => {
    if (formationId < 0) {
      console.log("[ERROR] Index cannot be negative")
    } else {
      dispatch({
        type: ADD_FORMATION,
        choreoId: choreoId,
        payload: formationId
      });
      dispatch({
        type: SWITCH_ACTIVE_FORMATION,
        payload: formationId
      })
    }
  }
}

export function removeFormation(choreoId, formationId) {
  return (dispatch, getState) => {
    if(hasFormation(choreoId, formationId, getState())) {
      let numFormations = getNumFormations(choreoId, getState());
      if(numFormations === 1){
        // Must always have at least 1 formation
        dispatch({
          type: ADD_FORMATION,
          choreoId: choreoId,
          payload: formationId + 1
        });
        numFormations++;
      }
      dispatch({
        type: REMOVE_FORMATION,
        choreoId: choreoId,
        payload: formationId
      })
      numFormations--;
      if (getActiveFormation(getState()) >= numFormations) {
        dispatch({
          type: SWITCH_ACTIVE_FORMATION,
          payload: numFormations - 1
        })
      }
    }
  }
}

export function gotoFormation(choreoId, targetFormationId) {
  return (dispatch, getState) => {
    // checks if formation is correct
    if (!hasFormation(choreoId, targetFormationId, getState())) {
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

export function reorderAndFocusFormation(choreoId, fromIndex, toIndex) {
  return (dispatch, getState) => {
    if (hasFormation(choreoId, fromIndex, getState()) && hasFormation(choreoId, toIndex, getState())) {
      dispatch({
        type: REORDER_FORMATION,
        choreoId: choreoId,
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