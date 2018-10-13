import {combineReducers} from 'redux';
import dances from './dances'
import UI from './ui'

const rootReducer = combineReducers({
  dances,
  UI
});

export default rootReducer;
