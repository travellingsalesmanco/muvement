import { ADD_DANCER_TO_FORMATION, MOVE_DANCER, REMOVE_DANCER_FROM_FORMATION, RENAME_FORMATION, DESELECT_DANCER } from "../constants/actionTypes";
import { getChoreo } from "../selectors/choreo";

function formationContainsDancer(choreoId, formationId, name, state) {
  return getChoreo(state, choreoId).formations[formationId].dancers.map(dancer => dancer.name).includes(name);
}

export function renameFormation(choreoId, formationId, name) {
  return dispatch => {
    dispatch({
      type: RENAME_FORMATION,
      choreoId: choreoId,
      formationId: formationId,
      payload: name
    })
  }
}

export function addDancerToFormation(choreoId, formationId, name) {
  return (dispatch, getState) => {
    if (!formationContainsDancer(choreoId, formationId, name, getState())) {
      dispatch({
        type: ADD_DANCER_TO_FORMATION,
        choreoId: choreoId,
        formationId: formationId,
        payload: {
          name: name,
          // Default position when added to stage
          position: [0.5, 0.5]
        }
      })
    } else {
      console.log("[ERROR] Dancer already on formation")
    }
  }
}

export function removeDancerFromFormation(choreoId, formationId, name) {
  return (dispatch, getState) => {
    if (formationContainsDancer(choreoId, formationId, name, getState())) {
      dispatch({
        type: REMOVE_DANCER_FROM_FORMATION,
        choreoId: choreoId,
        formationId: formationId,
        payload: name
      })
      dispatch({
        type: DESELECT_DANCER,
        payload: name
      })
    } else {
      console.log("[ERROR] Dancer not on formation")
    }
  }
}

export function moveDancer(choreoId, formationId, name, newPos) {
  return (dispatch, getState) => {
    if (formationContainsDancer(choreoId, formationId, name, getState())) {
      dispatch({
        type: MOVE_DANCER,
        choreoId: choreoId,
        formationId: formationId,
        payload: {
          name: name,
          // Default position when added to stage
          position: newPos
        }
      })
    } else {
      console.log("[ERROR] Dancer not on formation")
    }
  }
}
