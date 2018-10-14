import {ADD_DANCER_TO_FRAME} from "../constants/actionTypes";

function frameContainsDancer(danceId, frameId, name, state) {
  return state.dances[danceId].frames[frameId].dancers.map(dancer => dancer.name).includes(name);
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
          position: [0, 0]
        }
      })
    } else {
      console.log("[ERROR] Dancer already on frame")
    }
  }
}
