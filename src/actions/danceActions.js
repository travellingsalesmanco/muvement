import {ADD_DANCER, EDIT_STAGE_DIMENSIONS} from "../constants/actionTypes";

function isDuplicateDancer(danceId, name, state) {
  return state.dances[danceId].dancers.includes(name);
}

export function addDancer(danceId, name) {
  return (dispatch, getState) => {
    if (!isDuplicateDancer(danceId, name, getState())) {
      dispatch({
        type: ADD_DANCER,
        danceId: danceId,
        payload: name
      })
    } else {
      console.log("[ERROR] Duplicate dancer name")
    }
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
