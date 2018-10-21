import {
  CLEAR_DANCER_SELECTION,
  DESELECT_DANCER,
  SELECT_DANCER,
  SET_LABELS_VIEW,
  SWITCH_ACTIVE_FRAME,
  TIMELINE_JUMP,
  TIMELINE_PLAY,
  TIMELINE_PAUSE,
} from "../constants/actionTypes";
import { defaultUI } from "../constants/defaults";

export default (state = defaultUI, action) => {
  switch (action.type) {
    case SWITCH_ACTIVE_FRAME: {
      const { payload: frameId } = action;
      return {
        ...state,
        activeFrame: frameId
      }
    }
    case SELECT_DANCER: {
      const { payload: dancerName } = action;
      return {
        ...state,
        selectedDancers: [...state.selectedDancers, dancerName]
      }
    }
    case DESELECT_DANCER: {
      const { payload: dancerName } = action;
      return {
        ...state,
        selectedDancers: state.selectedDancers.filter(name => name !== dancerName)
      }
    }
    case CLEAR_DANCER_SELECTION: {
      return {
        ...state,
        selectedDancers: []
      }
    }
    case SET_LABELS_VIEW: {
      const { payload: labelState } = action;
      return {
        ...state,
        showLabels: labelState
      }
    }
    case TIMELINE_JUMP: {
      const {payload: targetMs} = action;
      return {
        ...state,
        elapsedTime: targetMs
      }
    }
    case TIMELINE_PLAY: {
      return {
        ...state,
        isPlaying: true
      }
    }
    case TIMELINE_PAUSE: {
      return {
        ...state,
        isPlaying: false
      }
    }

    default:
      return state;
  }
}