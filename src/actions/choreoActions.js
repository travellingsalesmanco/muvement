import {
  ADD_CHOREO,
  LOAD_CHOREO,
  REMOVE_CHOREO,
  UPDATE_CHOREO_IMAGE,
  ADD_DANCER,
  RENAME_DANCER,
  ADD_FORMATION,
  EDIT_STAGE_DIMENSIONS,
  REMOVE_DANCER,
  REORDER_FORMATION,
  SET_LABELS_VIEW,
  SWITCH_ACTIVE_FORMATION,
  REMOVE_FORMATION,
  UNDO_FORMATION_CHANGE, REDO_FORMATION_CHANGE, CLEAR_FORMATION_HISTORY, UPDATE_CHOREO_MUSIC,
  PUBLISH_CHOREO, UNPUBLISH_CHOREO
} from "../constants/actionTypes";
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
  // consider choreo as newer if the updatedAt is 30 seconds (arbitrary buffer) later than previous updatedAt
  return currChoreo ? currChoreo.updatedAt.seconds + 30 < choreo.updatedAt.seconds
    : true;
}

// TODO: proper storage check
function isStorageImage(choreoId, state) {
  const currChoreo = getChoreo(state, choreoId);
  return !currChoreo.imageUrl.includes("https://dummyimage.com");
}

export function addChoreo(id, choreo) {
  return (dispatch) => {
    let res = dispatch({
      type: ADD_CHOREO,
      choreoId: id,
      payload: choreo
    });
    return res;
  }
}

export function removeChoreo(id) {
  return (dispatch, getState) => {
    dispatch({
      type: REMOVE_CHOREO,
      choreoId: id,
      removeImage: isStorageImage(id, getState())
    })
    return Promise.resolve()
  }
}

export function updateChoreoImage(id, link) {
  return (dispatch) => {
    dispatch({
      type: UPDATE_CHOREO_IMAGE,
      choreoId: id,
      payload: link
    })
  }
}

export function updateChoreoMusic(id, link) {
  return (dispatch) => {
    dispatch({
      type: UPDATE_CHOREO_MUSIC,
      choreoId: id,
      payload: link
    })
  }
}

export function updateChoreoIfNewer(id, choreo) {
  return (dispatch, getState) => {
    if (isNewer(choreo, id, getState())) {
      dispatch({
        type: LOAD_CHOREO,
        choreoId: id,
        payload: choreo
      });
    }
    return Promise.resolve();
  }
}

export function syncCreatorChoreo(id, choreo, overwrite) {
  return (dispatch, getState) => {
    // Tracks if manual overwrite is required (when overwrite is not allowed)
    let requiresManualOverwrite = false;
    if (!hasChoreo(id, getState()) || !ownsChoreo(id, getState())) {
      dispatch({
        type: ADD_CHOREO,
        choreoId: id,
        payload: choreo
      });
    } else if (isNewer(choreo, id, getState())) {
      if (overwrite) {
        dispatch({
          type: LOAD_CHOREO,
          choreoId: id,
          payload: choreo
        });
      } else {
        requiresManualOverwrite = true;
      }
    }
    return Promise.resolve({
      requiresManualOverwrite: requiresManualOverwrite,
      affectedChoreo: {
        data: choreo,
        id: id
      }
    });
  }
}

export function syncCreatorChoreos(choreos, overwrite) {
  return (dispatch, getState) => {
    // Tracks if manual overwrite is required (when overwrite is not allowed)
    let requiresManualOverwrite = false;
    // Collates list of choreos that need manual overwrite
    let affectedChoreos = [];

    // Remove choreos no longer tagged under creator in cloud
    let lostChoreos = getLostChoreos(choreos, getState());
    lostChoreos.forEach((choreoId) => {
      dispatch({
        type: REMOVE_CHOREO,
        choreoId: choreoId,
        stale: true
      })
    });
    choreos.forEach((choreo) => {
      if (!hasChoreo(choreo.id, getState()) || !ownsChoreo(choreo.id, getState())) {
        // Add choreos not on local
        console.log("ADDING");
        dispatch({
          type: ADD_CHOREO,
          choreoId: choreo.id,
          payload: choreo.data
        });
      } else if (isNewer(choreo.data, choreo.id, getState())) {
        // Update existing choreos if newer and overwrite allowed
        if (overwrite) {
          dispatch({
            type: LOAD_CHOREO,
            choreoId: choreo.id,
            payload: choreo.data
          });
        } else {
          requiresManualOverwrite = true;
          affectedChoreos.push({
            data: choreo.data,
            id: choreo.id
          })
        }
      }
    });
    return Promise.resolve({
      requiresManualOverwrite: requiresManualOverwrite,
      affectedChoreos: affectedChoreos
    });
  }
}

export function addDancer(choreoId, name) {
  return (dispatch, getState) => {
    if (!containsDancer(choreoId, name, getState())) {
      dispatch({
        type: ADD_DANCER,
        choreoId: choreoId,
        payload: name
      })
    } else {
      console.log("[ERROR] Duplicate dancer name")
    }
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

export function removeDancer(choreoId, name) {
  return (dispatch, getState) => {
    if (containsDancer(choreoId, name, getState())) {
      dispatch({
        type: REMOVE_DANCER,
        choreoId: choreoId,
        payload: name
      })
    } else {
      console.log("[ERROR] Dancer does not exist")
    }
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

export function renameDancer(choreoId, oldName, newName) {
  return (dispatch, getState) => {
    if (containsDancer(choreoId, oldName, getState())) {
      if (!containsDancer(choreoId, newName, getState())) {
        dispatch({
          type: RENAME_DANCER,
          choreoId: choreoId,
          payload: {
            oldName: oldName,
            newName: newName
          }
        })
      } else {
        console.log("[ERROR] Duplicate dancer name")
      }
    } else {
      console.log("[ERROR] Dancer does not exist")
    }
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
        choreoId: choreoId,
        payload: formationId
      });
      return Promise.resolve()
    }
  }
}

export function removeFormation(choreoId, formationId) {
  return (dispatch, getState) => {
    if (hasFormation(choreoId, formationId, getState())) {
      let numFormations = getNumFormations(choreoId, getState());
      if (numFormations === 1) {
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
          choreoId: choreoId,
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
        choreoId: choreoId,
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
        choreoId: choreoId,
        payload: toIndex
      })
    } else {
      console.log("[ERROR] Index out of bounds")
    }
  }
}

export function undoFormationsChange(choreoId) {
  return (dispatch) => {
    dispatch({
      type: UNDO_FORMATION_CHANGE,
      choreoId: choreoId,
    })
  }
}

export function redoFormationsChange(choreoId) {
  return (dispatch) => {
    dispatch({
      type: REDO_FORMATION_CHANGE,
      choreoId: choreoId,
    })
  }
}

export function clearFormationsHistory(choreoId) {
  return (dispatch) => {
    dispatch({
      type: CLEAR_FORMATION_HISTORY,
      choreoId: choreoId,
    })
  }
}

export function publishChoreo(choreoId) {
  return (dispatch) => {
    dispatch({
      type: PUBLISH_CHOREO,
      choreoId: choreoId,
    })
  }
}

export function unpublishChoreo(choreoId) {
  return (dispatch) => {
    dispatch({
      type: UNPUBLISH_CHOREO,
      choreoId: choreoId,
    })
  }
}