import {TError} from '@core';
import {addNotification} from '@lib/front/components/store/notificationsSlice';
import {useAppDispatch} from '@lib/front/components/store/store';
import {useTranslations} from 'next-intl';

export const useErrorNotification = () => {
    const dispatch = useAppDispatch();
    const t = useTranslations();

    return (error: unknown) => {
        if (error instanceof TError || TError.isError(error)) {
            dispatch(
                addNotification({
                    title: t(`${error.key}.title`, error.data),
                    description: t(`${error.key}.description`, error.data),
                    id: btoa(JSON.stringify(error)),
                    level: 'Error',
                }),
            );
        }

        return null;
    };
};
