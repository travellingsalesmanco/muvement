import {
  CLEAR_DANCER_SELECTION,
  DESELECT_DANCER,
  SELECT_DANCER,
  SET_LABELS_VIEW,
  SWITCH_ACTIVE_FORMATION,
  TIMELINE_JUMP,
  TIMELINE_PLAY,
  TIMELINE_PAUSE,
  LOAD_ANIMATED_VIEW,
  UNLOAD_ANIMATED_VIEW,
  SET_PLAYBACK_RATE,
} from "../constants/actionTypes";
import { defaultUI } from "../constants/defaults";

export default (state = defaultUI, action) => {
  switch (action.type) {
    case SWITCH_ACTIVE_FORMATION: {
      const { payload: formationId } = action;
      return {
        ...state,
        activeFormation: formationId
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
    case LOAD_ANIMATED_VIEW: {
      return {
        ...state,
        animated: true
      }
    }
    case UNLOAD_ANIMATED_VIEW: {
      return {
        ...state,
        animated: false
      }
    }
    case SET_PLAYBACK_RATE: {
      const {payload: rate} = action;
      return {
        ...state,
        playbackRate: rate
      }
    }

    default:
      return state;
  }
}