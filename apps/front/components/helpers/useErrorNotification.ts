import {TError} from '@core';
import {addNotification} from '@lib/front/components/store/notificationsSlice';
import {useAppDispatch} from '@lib/front/components/store/store';
import {useTranslations} from 'next-intl';
import {HttpStatusCode} from '@shared/enums';

export const useErrorNotification = () => {
    const dispatch = useAppDispatch();
    const t = useTranslations();

    return (error: unknown) => {
        console.error(error);

        if (error instanceof TError || TError.isError(error)) {
            dispatch(
                addNotification({
                    title: t(`${error.key}.title`, error.data),
                    description: t(`${error.key}.description`, error.data),
                    id: btoa(JSON.stringify(error)),
                    level:
                        error.code === HttpStatusCode.TOO_MANY_REQUESTS
                            ? 'Warning'
                            : 'Error',
                }),
            );
        }

        return null;
    };
};
