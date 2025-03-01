import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import AuthReducer from './AuthSlice.jsx';
import { combineReducers } from '@reduxjs/toolkit';

const persistConfig = {
    key: 'root',
    storage,
};

const authReducer = combineReducers({
    auth: AuthReducer,
});

// Persisted Reducer
const persistedReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST'], // ✅ Ignore persist/PERSIST action
            },
        }),
});

// Create Persistor
export const persistor = persistStore(store);
export default store;