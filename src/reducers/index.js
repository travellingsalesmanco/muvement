import { combineReducers } from 'redux';
import choreos from './choreos'
import UI from './ui'
import { USER_LOGOUT } from '../constants/actionTypes';

const appReducer = combineReducers({
  choreos,
  UI
});

// Root reducer
export default (state, action) => {
  if (action.type === USER_LOGOUT) {
    // On user logout, reset state to default
    state = undefined;
  }
  return appReducer(state, action)
};