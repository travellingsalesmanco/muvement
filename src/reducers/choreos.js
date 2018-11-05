import { combineReducers } from 'redux';
import {
  ADD_CHOREO,
  LOAD_CHOREO,
  EDIT_STAGE_DIMENSIONS,
  PUBLISH_CHOREO,
  REMOVE_CHOREO,
  RENAME_CHOREO,
  UNPUBLISH_CHOREO,
  UPDATE_CHOREO_IMAGE,
  UPDATE_CHOREO_MUSIC,
} from '../constants/actionTypes';
import { defaultStageDim } from '../constants/defaults';
import { defaultChoreos } from '../constants/dummyData';
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

const imageUrlReducer = (state = null, action) => {
  return action.type === UPDATE_CHOREO_IMAGE ? action.payload : state;
}

const musicUrlReducer = (state = null, action) => {
  return action.type === UPDATE_CHOREO_MUSIC ? action.payload : state;
}

const choreoReducer = combineReducers({
  createdAt: (state = null) => state,
  creator: (state = null) => state,
  updatedAt: (state = null) => state,
  imageUrl: imageUrlReducer,
  musicUrl: musicUrlReducer,
  name: choreoNameReducer,
  published: choreoPublishedReducer,
  stageDim: stageDimReducer,
  dancers,
  formations
});

// Choreos
export default (state = defaultChoreos, action) => {
  switch (action.type) {
    case ADD_CHOREO: {
      const { choreoId, payload: choreo } = action;
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
      const { choreoId, payload: choreo } = action;
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
      const { choreoId } = action;
      const { [choreoId]: _, ...prunedByIds } = state.byId;
      return {
        ...state,
        byId: prunedByIds,
        myChoreos: state.myChoreos.filter(id => id !== choreoId)
      }
    }
    default: {
      if (action.choreoId !== null && action.choreoId !== undefined) {
        const { choreoId } = action;
        return {
          ...state,
          byId: {
            ...state.byId,
            [choreoId]: choreoReducer(state.byId[choreoId], action)
          }
        }
      }
      return state;
    }
  }
}