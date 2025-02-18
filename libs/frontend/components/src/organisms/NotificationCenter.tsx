'use client';
import {type ReactNode, useEffect, useState} from 'react';
import {createPortal} from 'react-dom';
import {styled} from '@mui/material/styles';
import BubbleNotification from '@lib/front/components/atoms/Bubble';
import {removeNotification} from '@lib/front/components/store/notificationsSlice';
import {
    type RootState,
    useAppDispatch,
    useAppSelector,
} from '@lib/front/components/store/store';

const SnackbarContainer = styled('div')<{
    vertical: 'top' | 'bottom';
    horizontal: 'left' | 'right';
}>(({theme, vertical, horizontal}) => {
    const spacing = theme.spacing(2);
    return {
        gap: theme.spacing(1.5),
        position: 'fixed',
        zIndex: theme.zIndex.snackbar,
        [vertical]: spacing,
        [horizontal]: spacing,
        display: 'flex',
        flexDirection: 'column',
        alignItems: horizontal === 'right' ? 'flex-end' : 'flex-start',
        pointerEvents: 'none',
    };
});

const NotificationsContainer = () => {
    const {notifications, anchorOrigin} = useAppSelector(
        (state: RootState) => state.notifications,
    );
    const dispatch = useAppDispatch();

    const [mounted, setMounted] = useState<boolean>(false);
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    const Container = (): ReactNode => {
        return (
            <SnackbarContainer
                vertical={anchorOrigin.vertical}
                horizontal={anchorOrigin.horizontal}
            >
                {notifications.map((notification) => (
                    <div
                        key={notification.id}
                        style={{pointerEvents: 'auto', marginBottom: 8}}
                    >
                        <BubbleNotification
                            id={notification.id}
                            count={notification.count}
                            level={notification.level}
                            title={notification.title}
                            description={notification.description}
                            onClose={() =>
                                dispatch(removeNotification(notification.id))
                            }
                        />
                    </div>
                ))}
            </SnackbarContainer>
        ) as ReactNode;
    };

    return createPortal((<Container />) as ReactNode, document.body);
};

export default NotificationsContainer;
