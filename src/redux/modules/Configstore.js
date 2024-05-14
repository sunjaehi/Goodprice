import { createStore } from 'redux';
import Member from '../modules/Member';
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistReducer,persistStore } from 'redux-persist';
import storageSession from 'redux-persist/lib/storage/session';

//redux는 action->dispatch->reducer순으로 동작
//combinereducers는 독립적인 reducer의 반환 값을 하나의 상태 객체로 만들어줌


const persistConfig = {
    key:'root',
    storage:storageSession,
    whitelist:['member'] //유지하고 싶은 값을 배열로 전달 <->blacklist
};
const rootReducer = combineReducers({
    member : Member,
});
const persistedReducer = persistReducer(persistConfig, rootReducer);
const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        })
});
//persistGate 사용을 위한 persistor
//const persistor = persistStore(store);

export default store;