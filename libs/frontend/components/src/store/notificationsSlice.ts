import {createSlice, type PayloadAction} from '@reduxjs/toolkit';
import type {BubbleProps} from '@lib/front/components/atoms/Bubble';

export type NotificationItem = BubbleProps;

export interface NotificationsState {
    notifications: NotificationItem[];
    maxNotifications: number;
    anchorOrigin: {
        vertical: 'top' | 'bottom';
        horizontal: 'left' | 'right';
    };
}

const initialState: NotificationsState = {
    notifications: [],
    maxNotifications: 5,
    anchorOrigin: {vertical: 'bottom', horizontal: 'left'},
};

const notificationsSlice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {
        addNotification(
            state,
            action: PayloadAction<
                Omit<NotificationItem, 'id' | 'count'> &
                    Partial<Pick<NotificationItem, 'id'>>
            >,
        ) {
            if (action.payload.id) {
                const existingNotification = state.notifications.find(
                    (i) => i.id === action.payload.id,
                );

                if (existingNotification) {
                    existingNotification.count =
                        (existingNotification.count || 1) + 1;

                    Object.assign(existingNotification, action.payload);
                    return;
                }
            }

            const newNotification: NotificationItem = {
                ...action.payload,
                id: action.payload?.id ?? Date.now().toString(),
                count: 1,
            };

            state.notifications.unshift(newNotification);

            if (state.notifications.length > state.maxNotifications) {
                state.notifications.pop();
            }
        },
        removeNotification(state, action: PayloadAction<string>) {
            state.notifications = state.notifications.filter(
                (n) => n.id !== action.payload,
            );
        },
        clearNotifications(state) {
            state.notifications = [];
        },
        setAnchorOrigin(
            state,
            action: PayloadAction<NotificationsState['anchorOrigin']>,
        ) {
            state.anchorOrigin = action.payload;
        },
        setMaxNotifications(state, action: PayloadAction<number>) {
            state.maxNotifications = action.payload;
        },
    },
});

export const {
    addNotification,
    removeNotification,
    clearNotifications,
    setAnchorOrigin,
    setMaxNotifications,
} = notificationsSlice.actions;

export default notificationsSlice.reducer;
