import { applyMiddleware, createStore } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import thunk from 'redux-thunk';
import rootReducer from '../reducers';
import localForage from 'localforage';

localForage.config({
  name: "Muvement",
  storeName: "muvement"
})
const persistConfig = {
  key: "muvement",
  storage: localForage
}
const persistedReducer = persistReducer(persistConfig, rootReducer);

export default () => {
  const store = createStore(
    persistedReducer,
    applyMiddleware(thunk)
  );
  const persistor = persistStore(store);
  return { store, persistor }
}