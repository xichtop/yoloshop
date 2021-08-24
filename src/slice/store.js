import { configureStore } from "@reduxjs/toolkit";
import  cartReducer  from './cartSlice';
import  userReducer  from './userSlice';

import { loadState, saveState } from './localStorage';

const persistState = loadState();

const rootReducer = {
  cart: cartReducer,
  user: userReducer,
}

const store = configureStore({
    reducer: rootReducer,
    preloadedState: persistState
});

store.subscribe(() => {
  saveState(store.getState());
})

export default store;