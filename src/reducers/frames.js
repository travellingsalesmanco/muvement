import {
  ADD_DANCER_TO_FRAME,
  ADD_FRAME,
  EDIT_FRAME_DURATION,
  MOVE_DANCER,
  REMOVE_DANCER,
  REMOVE_DANCER_FROM_FRAME,
  REMOVE_FRAME,
  RENAME_DANCER,
  RENAME_FRAME
} from "../constants/actions";
import {defaultFrame} from "../constants/defaults";

const frameReducer = (state = defaultFrame, action) => {
  switch (action.type) {
    case ADD_DANCER_TO_FRAME: {
      const {payload: newDancerWithPos} = action;
      return {
        ...state,
        dancers: [...state.dancers, newDancerWithPos]
      };
    }
    case REMOVE_DANCER:
    case REMOVE_DANCER_FROM_FRAME: {
      const {payload: dancerName} = action;
      return {
        ...state,
        dancers: state.dancers.filter(dancer => dancer.name !== dancerName)
      };
    }
    case MOVE_DANCER: {
      const {payload: newDancerWithPos} = action;
      let newFrameDancers = state.dancers.filter(dancer => dancer.name !== newDancerWithPos.name);
      newFrameDancers.push(newDancerWithPos);
      return {
        ...state,
        dancers: newFrameDancers
      };
    }
    case RENAME_DANCER: {
      const {oldName, newName} = action.payload;
      return {
        ...state,
        dancers: state.dancers.map(
          dancer => dancer.name === oldName ?
            {...dancer, name: newName} :
            dancer
        )
      }
    }
    case RENAME_FRAME: {
      const {payload: newName} = action;
      return {
        ...state,
        name: newName
      }
    }
    case EDIT_FRAME_DURATION: {
      const {payload: newDuration} = action;
      return {
        ...state,
        duration: newDuration
      }
    }
    default:
      return state;
  }
};

// Frames reducer
export default (state = [], action) => {
  switch (action.type) {

    case ADD_FRAME: {
      const {index, payload: frame} = action;
      let frames = state.slice();
      frames.splice(index, 0, frame);
      return frames;
    }
    case REMOVE_FRAME: {
      const {payload: indexToRemove} = action;
      let frames = state.slice();
      frames.splice(indexToRemove, 1);
      return frames;
    }

    // All frame edit operations
    case REMOVE_DANCER:
    case RENAME_DANCER: {
      return state.map(frame => frameReducer(frame, action))
    }

    // Single frame edit operations
    case ADD_DANCER_TO_FRAME:
    case REMOVE_DANCER_FROM_FRAME:
    case MOVE_DANCER:
    case RENAME_FRAME:
    case EDIT_FRAME_DURATION: {
      const {index: frameIdx, ...prunedAction} = action;
      return state.map((frame, idx) => {
        if (idx === frameIdx) {
          return frameReducer(frame, prunedAction);
        } else {
          return frame;
        }
      });
    }
    default:
      return state;
  }
};