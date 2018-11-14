import { applyMiddleware, createStore } from 'redux';
import { persistStore, persistReducer, createMigrate } from 'redux-persist';
import thunk from 'redux-thunk';
import rootReducer from '../reducers';
import localForage from 'localforage';
import {composeWithDevTools} from 'redux-devtools-extension'
import { firestoreWriter } from "../middleware/firestoreWrite";
import { DUMMY_ACTION } from '../constants/actionTypes';

localForage.config({
  name: "Muvement",
  storeName: "muvement"
})
const migrations = {
  0: () => rootReducer(undefined, DUMMY_ACTION),
  1: () => rootReducer(undefined, DUMMY_ACTION),
  2: () => rootReducer(undefined, DUMMY_ACTION),
  3: () => rootReducer(undefined, DUMMY_ACTION)
}
const persistConfig = {
  key: "muvement",
  storage: localForage,
  blacklist: ['UI'],
  version: 3,
  migrate: createMigrate(migrations)
}
const persistedReducer = persistReducer(persistConfig, rootReducer);

export default () => {
  const store = createStore(
    persistedReducer,
    composeWithDevTools(applyMiddleware(thunk, firestoreWriter))
  );
  const persistor = persistStore(store);
  return { store, persistor }
}
