import { combineReducers } from 'redux';
import {
  ADD_CHOREO,
  LOAD_CHOREO,
  EDIT_STAGE_DIMENSIONS,
  PUBLISH_CHOREO,
  REMOVE_CHOREO,
  RENAME_CHOREO,
  UNPUBLISH_CHOREO
} from '../constants/actionTypes';
import { defaultStageDim } from '../constants/defaults';
import { demoChoreos } from '../constants/dummyData';
import dancers from './dancers';
import formations from './formations';

const choreoNameReducer = (state = "", action) => action.type === RENAME_CHOREO ? action.payload : state;

const choreoPublishedReducer = (state = false, action) => {
  switch (action.type) {
    case PUBLISH_CHOREO:
      return true;
    case UNPUBLISH_CHOREO:
      return false;
    default:
      return state;
  }
}

const stageDimReducer = (state = defaultStageDim, action) => {
  switch (action.type) {
    case EDIT_STAGE_DIMENSIONS: {
      const { payload: editedDimensions } = action;
      return {
        ...state,
        ...editedDimensions
      };
    }
    default:
      return state;
  }
};

const choreoReducer = combineReducers({
  name: choreoNameReducer,
  published: choreoPublishedReducer,
  stageDim: stageDimReducer,
  dancers,
  formations
});

// Copy over metadata (e.g. firebase createdAt timestamps) when updating choreo
const choreoWithMetaReducer = (state, action) => {
  return {
    ...state,
    ...choreoReducer(state, action)
  }
}

// Choreos
// TODO: Remove dummy choreo when deploying
export default (state = demoChoreos, action) => {
  switch (action.type) {
    case ADD_CHOREO: {
      const { choreoId, choreo } = action.payload;
      return {
        ...state,
        byId: {
          ...state.byId,
          [choreoId]: choreo
        },
        myChoreos: [...state.myChoreos, choreoId]
      }
    }
    case LOAD_CHOREO: {
      const { choreoId, choreo } = action.payload;
      return {
        ...state,
        byId: {
          ...state.byId,
          [choreoId]: choreo
        },
        myChoreos: [...state.myChoreos]
      }
    }
    case REMOVE_CHOREO: {
      const { payload: idToRemove } = action;
      const { [idToRemove]: _, ...prunedByIds } = state.byId;
      return {
        ...state,
        byId: prunedByIds,
        myChoreos: state.myChoreos.filter(choreoId => choreoId !== idToRemove)
      }
    }
    default: {
      if (action.choreoId !== null && action.choreoId !== undefined) {
        const { choreoId, ...prunedAction } = action;
        return {
          ...state,
          byId: {
            ...state.byId,
            [choreoId]: choreoWithMetaReducer(state.byId[choreoId], prunedAction)
          }
        }
      }
      return state;
    }
  }
}