import {ADD_DANCER, REMOVE_DANCER, RENAME_DANCER} from "../constants/actionTypes";

// Dancers reducer
export default (state = [], action) => {
  switch (action.type) {
    case ADD_DANCER: {
      const {payload: newDancer} = action;
      return [
        ...state,
        newDancer
      ];
    }
    case REMOVE_DANCER: {
      const {payload: dancerToRemove} = action;
      return state.filter(name => name !== dancerToRemove);
    }
    case RENAME_DANCER: {
      const {oldName, newName} = action.payload;
      let newDancers = state.filter(name => name !== oldName);
      newDancers.push(newName);
      return newDancers;
    }
    default:
      return state;
  }
};