import {parseResult} from '@core';
import {getQueryClient} from '@lib/front/components/atoms/getQueryClient';
import {useAppDispatch} from '@lib/front/components/store/store';
import {logout} from '@lib/front/components/store/authSlice';
import {CookieNames} from '@shared/enums';
import {useMutation} from '@tanstack/react-query';
import {logoutUser} from '@front/components/actions/logoutUser';
import {useErrorNotification} from '@front/components/helpers/useErrorNotification';
import {useCookies} from 'next-client-cookies';
import {BroadcastingChannels} from '@front/consts';

export const useUserLogout = () => {
    const queryClient = getQueryClient();
    const dispatch = useAppDispatch();
    const cookieStore = useCookies();

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
                cookieStore.remove(CookieNames.SESSION_ID);

                const logoutChannel = new BroadcastChannel(
                    BroadcastingChannels.logged_out,
                );
                logoutChannel.postMessage({});
                logoutChannel.close();
            },
            onError: useErrorNotification(),
        },
        queryClient,
    );
};
