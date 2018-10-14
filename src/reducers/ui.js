import {SWITCH_ACTIVE_DANCE, SWITCH_ACTIVE_FRAME} from "../constants/actionTypes";
import {defaultUI} from "../constants/defaults";

export default (state = defaultUI, action) => {
  switch (action.type) {
    case SWITCH_ACTIVE_DANCE: {
      const {payload: danceId} = action;
      return {
        ...state,
        activeDance: danceId,
        activeFrame: 0 // Need to reset active frame as well
      }
    }
    case SWITCH_ACTIVE_FRAME: {
      const {payload: frameId} = action;
      return {
        ...state,
        activeFrame: frameId
      }
    }
    default:
      return state;
  }
}