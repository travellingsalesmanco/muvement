import {
  ADD_DANCER_TO_FORMATION,
  ADD_FORMATION,
  EDIT_FORMATION_DURATION,
  MOVE_DANCER,
  REMOVE_DANCER,
  REMOVE_DANCER_FROM_FORMATION,
  REMOVE_FORMATION,
  RENAME_DANCER,
  RENAME_FORMATION,
  REORDER_FORMATION,
  EDIT_FORMATION_TRANSITION,
  CLEAR_FORMATION_TRANSITION
} from '../constants/actionTypes';
import { defaultFormation, defaultTransition } from '../constants/defaults';

const formationReducer = (state = defaultFormation, action) => {
  switch (action.type) {
    case ADD_DANCER_TO_FORMATION: {
      const { payload: newDancerWithPos } = action;
      return {
        ...state,
        dancers: [...state.dancers, newDancerWithPos]
      };
    }
    case REMOVE_DANCER:
    case REMOVE_DANCER_FROM_FORMATION: {
      const { payload: dancerName } = action;
      return {
        ...state,
        dancers: state.dancers.filter(dancer => dancer.name !== dancerName)
      };
    }
    case MOVE_DANCER: {
      const { payload: newDancerWithPos } = action;
      let newFormationDancers = state.dancers.filter(dancer => dancer.name !== newDancerWithPos.name);
      newFormationDancers.push(newDancerWithPos);
      return {
        ...state,
        dancers: newFormationDancers
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
    case RENAME_FORMATION: {
      const { payload: newName } = action;
      return {
        ...state,
        name: newName
      }
    }
    case EDIT_FORMATION_DURATION: {
      const { payload: newDuration } = action;
      return {
        ...state,
        duration: newDuration
      }
    }
    case EDIT_FORMATION_TRANSITION: {
      const {payload: newTransition} = action;
      return {
        ...state,
        transitionBefore: {
          ...state.transitionBefore,
          ...newTransition
        }
      }
    }
    case CLEAR_FORMATION_TRANSITION: {
      return {
        ...state,
        transitionBefore: {
          ...defaultTransition
        }
      }
    }
    default:
      return state;
  }
};

// Formations reducer
export default (state = [defaultFormation], action) => {
  switch (action.type) {
    case ADD_FORMATION: {
      const { payload: index } = action;
      // TODO: When min formation == 1 is lifted, to review
      let formations = state.slice();
      let newFormation = { ...formations[index - 1] };
      newFormation.name = '';
      formations.splice(index, 0, newFormation);
      return formations;
    }
    case REMOVE_FORMATION: {
      const { payload: indexToRemove } = action;
      let formations = state.slice();
      formations.splice(indexToRemove, 1);
      return formations;
    }
    case REORDER_FORMATION: {
      const { fromIndex, toIndex } = action.payload;
      let formations = state.slice();
      const toMove = formations[fromIndex];
      formations.splice(fromIndex, 1);
      formations.splice(toIndex, 0, toMove);
      return formations;
    }

    // Operations applied to all formations
    case REMOVE_DANCER:
    case RENAME_DANCER: {
      return state.map(formation => formationReducer(formation, action))
    }
    // Operations applied to a single formation
    default:
      if (action.formationId !== null && action.formationId !== undefined) {
        const { formationId, ...prunedAction } = action;
        return state.map((formation, idx) => idx === formationId ? formationReducer(formation, prunedAction) : formation);
      }
      return state;
  }
};