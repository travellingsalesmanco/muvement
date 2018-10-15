import { ADD_DANCER_TO_FRAME, MOVE_DANCER, REMOVE_DANCER_FROM_FRAME, RENAME_FRAME, DESELECT_DANCER } from "../constants/actionTypes";

function frameContainsDancer(danceId, frameId, name, state) {
  return state.dances[danceId].frames[frameId].dancers.map(dancer => dancer.name).includes(name);
}

export function renameFrame(danceId, frameId, name) {
  return dispatch => {
    dispatch({
      type: RENAME_FRAME,
      danceId: danceId,
      frameId: frameId,
      payload: name
    })
  }
}

export function addDancerToFrame(danceId, frameId, name) {
  return (dispatch, getState) => {
    if (!frameContainsDancer(danceId, frameId, name, getState())) {
      dispatch({
        type: ADD_DANCER_TO_FRAME,
        danceId: danceId,
        frameId: frameId,
        payload: {
          name: name,
          // Default position when added to stage
          position: [0.5, 0.5]
        }
      })
    } else {
      console.log("[ERROR] Dancer already on frame")
    }
  }
}

export function removeDancerFromFrame(danceId, frameId, name) {
  return (dispatch, getState) => {
    if (frameContainsDancer(danceId, frameId, name, getState())) {
      dispatch({
        type: REMOVE_DANCER_FROM_FRAME,
        danceId: danceId,
        frameId: frameId,
        payload: name
      })
      dispatch({
        type: DESELECT_DANCER,
        payload: name
      })
    } else {
      console.log("[ERROR] Dancer not on frame")
    }
  }
}

export function moveDancer(danceId, frameId, name, newPos) {
  return (dispatch, getState) => {
    if (frameContainsDancer(danceId, frameId, name, getState())) {
      dispatch({
        type: MOVE_DANCER,
        danceId: danceId,
        frameId: frameId,
        payload: {
          name: name,
          // Default position when added to stage
          position: newPos
        }
      })
    } else {
      console.log("[ERROR] Dancer not on frame")
    }
  }
}
