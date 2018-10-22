import { ADD_DANCER_TO_FORMATION, MOVE_DANCER, REMOVE_DANCER_FROM_FORMATION, RENAME_FORMATION, DESELECT_DANCER } from "../constants/actionTypes";
import { getDance } from "../selectors/dance";

function formationContainsDancer(danceId, formationId, name, state) {
  return getDance(state, danceId).formations[formationId].dancers.map(dancer => dancer.name).includes(name);
}

export function renameFormation(danceId, formationId, name) {
  return dispatch => {
    dispatch({
      type: RENAME_FORMATION,
      danceId: danceId,
      formationId: formationId,
      payload: name
    })
  }
}

export function addDancerToFormation(danceId, formationId, name) {
  return (dispatch, getState) => {
    if (!formationContainsDancer(danceId, formationId, name, getState())) {
      dispatch({
        type: ADD_DANCER_TO_FORMATION,
        danceId: danceId,
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

export function removeDancerFromFormation(danceId, formationId, name) {
  return (dispatch, getState) => {
    if (formationContainsDancer(danceId, formationId, name, getState())) {
      dispatch({
        type: REMOVE_DANCER_FROM_FORMATION,
        danceId: danceId,
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

export function moveDancer(danceId, formationId, name, newPos) {
  return (dispatch, getState) => {
    if (formationContainsDancer(danceId, formationId, name, getState())) {
      dispatch({
        type: MOVE_DANCER,
        danceId: danceId,
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
