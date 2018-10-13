import {SWITCH_ACTIVE_DANCE} from "../constants/actionTypes";
import {defaultUI} from "../constants/defaults";

export default (state = defaultUI, action) => {
  switch (action.type) {
    case SWITCH_ACTIVE_DANCE: {
      const {payload: danceId} = action;
      return {
        ...state,
        activeDance: danceId
      }
    }
    default:
      return state;
  }
}