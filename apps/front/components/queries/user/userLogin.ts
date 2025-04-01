import {parseResult, TError} from '@core';
import {useMutation} from '@tanstack/react-query';
import {loginUser} from '@front/components/actions/loginUser';
import {addNotification} from '@lib/front/components/store/notificationsSlice';
import {getQueryClient} from '@lib/front/components/atoms/getQueryClient';
import {useAppDispatch} from '@lib/front/components/store/store';
import {setUser} from '@lib/front/components/store/authSlice';
import {useTranslations} from 'next-intl';
import {useErrorNotification} from '../../helpers/useErrorNotification';

export const useUserLogin = () => {
    const queryClient = getQueryClient();
    const dispatch = useAppDispatch();
    const t = useTranslations();

    return useMutation({
        mutationFn: async (data: {email: string; password: string}) => {
            const rawResult = await loginUser(data);
            const result = parseResult(rawResult);

            if (result.isErr()) {
                throw result.unwrapErr();
            }

            return result.unwrap();
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({queryKey: ['/servers'], exact: false});
            queryClient.invalidateQueries({
                queryKey: ['/users/status', '/users/has-credentials'],
                exact: false,
            });

            dispatch(setUser(data));
        },
        onError: useErrorNotification(),
    });
};
