import {combineReducers} from 'redux'
import dancers from './dancers'
import frames from './frames'
import {ADD_DANCE, EDIT_STAGE_DIMENSIONS, REMOVE_DANCE, RENAME_DANCE} from '../constants/actionTypes';
import {defaultStageDim} from "../constants/defaults";

const danceNameReducer = (state = "", action) => {
  switch (action.type) {
    case RENAME_DANCE:
      return action.payload;
    default:
      return state
  }
};
const stageDimReducer = (state = defaultStageDim, action) => {
  switch (action.type) {
    case EDIT_STAGE_DIMENSIONS: {
      const {payload: editedDimensions} = action;
      return {
        ...state,
        ...editedDimensions
      };
    }
    default:
      return state;
  }
};

const danceReducer = combineReducers({
  name: danceNameReducer,
  stageDim: stageDimReducer,
  dancers,
  frames
});

// Dances
export default (state = [], action) => {
  switch (action.type) {
    case ADD_DANCE: {
      const {payload: danceToAdd} = action;
      let newDances = state.slice();
      newDances.push(danceToAdd);
      return newDances;
    }
    case REMOVE_DANCE: {
      const {payload: indexToRemove} = action;
      let dances = state.slice();
      dances.splice(indexToRemove, 1);
      return dances;
    }
    default:
      if (action.danceId) {
        const {danceId, ...prunedAction} = action;
        return state.map((dance, idx) => idx === danceId ? danceReducer(dance, prunedAction) : dance);
      }
      return state;
  }
}
