import {useDispatch, useSelector, useStore} from 'react-redux';
import {configureStore} from '@reduxjs/toolkit';
import notificationReducer from './notificationsSlice';
import themeReducer from './themeSlice';
import modalReducer from './modalSlice';
import authReducer from './authSlice';

export const makeStore = () => {
    return configureStore({
        reducer: {
            auth: authReducer,
            notifications: notificationReducer,
            theme: themeReducer,
            modal: modalReducer,
        },
        devTools: true,
    });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppStore = useStore.withTypes<AppStore>();
