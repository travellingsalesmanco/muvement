import { combineReducers } from 'redux';
import choreos from './choreos'
import UI from './ui'

const rootReducer = combineReducers({
  choreos,
  UI
});

export default rootReducer;
