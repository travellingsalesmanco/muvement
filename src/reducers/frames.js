import {
  ADD_DANCER_TO_FRAME,
  ADD_FRAME,
  EDIT_FRAME_DURATION,
  MOVE_DANCER,
  REMOVE_DANCER,
  REMOVE_DANCER_FROM_FRAME,
  REMOVE_FRAME,
  RENAME_DANCER,
  RENAME_FRAME,
  REORDER_FRAME,
  EDIT_FRAME_TRANSITION,
  CLEAR_FRAME_TRANSITION
} from '../constants/actionTypes';
import { defaultFrame, defaultTransition } from '../constants/defaults';

const frameReducer = (state = defaultFrame, action) => {
  switch (action.type) {
    case ADD_DANCER_TO_FRAME: {
      const { payload: newDancerWithPos } = action;
      return {
        ...state,
        dancers: [...state.dancers, newDancerWithPos]
      };
    }
    case REMOVE_DANCER:
    case REMOVE_DANCER_FROM_FRAME: {
      const { payload: dancerName } = action;
      return {
        ...state,
        dancers: state.dancers.filter(dancer => dancer.name !== dancerName)
      };
    }
    case MOVE_DANCER: {
      const { payload: newDancerWithPos } = action;
      let newFrameDancers = state.dancers.filter(dancer => dancer.name !== newDancerWithPos.name);
      newFrameDancers.push(newDancerWithPos);
      return {
        ...state,
        dancers: newFrameDancers
      };
    }
    case RENAME_DANCER: {
      const { oldName, newName } = action.payload;
      return {
        ...state,
        dancers: state.dancers.map(
          dancer => dancer.name === oldName ?
            { ...dancer, name: newName } :
            dancer
        )
      }
    }
    case RENAME_FRAME: {
      const { payload: newName } = action;
      return {
        ...state,
        name: newName
      }
    }
    case EDIT_FRAME_DURATION: {
      const { payload: newDuration } = action;
      return {
        ...state,
        duration: newDuration
      }
    }
    case EDIT_FRAME_TRANSITION: {
      const {payload: newTransition} = action;
      return {
        ...state,
        transition: {
          ...state.transition,
          ...newTransition
        }
      }
    }
    case CLEAR_FRAME_TRANSITION: {
      return {
        ...state,
        transition: {
          ...defaultTransition
        }
      }
    }
    default:
      return state;
  }
};

// Frames reducer
export default (state = [defaultFrame], action) => {
  switch (action.type) {
    case ADD_FRAME: {
      const { payload: index } = action;
      let frames = state.slice();
      frames.splice(index, 0, defaultFrame);
      return frames;
    }
    case REMOVE_FRAME: {
      const { payload: indexToRemove } = action;
      let frames = state.slice();
      frames.splice(indexToRemove, 1);
      return frames;
    }
    case REORDER_FRAME: {
      const { fromIndex, toIndex } = action.payload;
      let frames = state.slice();
      const toMove = frames[fromIndex];
      frames.splice(fromIndex, 1);
      frames.splice(toIndex, 0, toMove);
      return frames;
    }

    // Operations applied to all frames
    case REMOVE_DANCER:
    case RENAME_DANCER: {
      return state.map(frame => frameReducer(frame, action))
    }
    // Operations applied to a single frame
    default:
      if (action.frameId !== null && action.frameId !== undefined) {
        const { frameId, ...prunedAction } = action;
        return state.map((frame, idx) => idx === frameId ? frameReducer(frame, prunedAction) : frame);
      }
      return state;
  }
};