import {parseResult} from '@core';
import {getQueryClient} from '@lib/front/components/atoms/getQueryClient';
import {useAppDispatch} from '@lib/front/components/store/store';
import {logout} from '@lib/front/components/store/authSlice';
import {CookieNames} from '@shared/enums';
import {useMutation} from '@tanstack/react-query';
import {logoutUser} from '@front/components/actions/logoutUser';
import {useErrorNotification} from '@front/components/helpers/useErrorNotification';
import {useCookies} from 'next-client-cookies';

export const useUserLogout = () => {
    const queryClient = getQueryClient();
    const dispatch = useAppDispatch();

    return useMutation(
        {
            mutationFn: async () => {
                const response = parseResult(await logoutUser());
                if (response.isErr()) {
                    console.warn(
                        `Error from server on logout:`,
                        response.unwrapErr(),
                    );
                }

                const cookieStore = useCookies();
                cookieStore.remove(CookieNames.SESSION_ID);
            },
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: ['/servers'],
                    exact: false,
                });
                queryClient.invalidateQueries({
                    queryKey: ['/users/status', '/users/has-credentials'],
                    exact: false,
                });

                dispatch(logout());
            },
            onError: useErrorNotification(),
        },
        queryClient,
    );
};
