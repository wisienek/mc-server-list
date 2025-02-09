import {useDispatch, useSelector, useStore} from 'react-redux';
import {configureStore} from '@reduxjs/toolkit';
import authReducer from './authSlice';
import notificationReducer from './notificationsSlice';

export const makeStore = () => {
    return configureStore({
        reducer: {
            auth: authReducer,
            notifications: notificationReducer,
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
