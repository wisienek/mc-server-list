import {getQueryClient} from '@lib/front/components/atoms/getQueryClient';
import {useAppDispatch} from '@lib/front/components/store/store';
import {logout} from '@lib/front/components/store/authSlice';
import {useMutation} from '@tanstack/react-query';
import {logoutUser} from '@front/components/actions/logoutUser';
import {useErrorNotification} from '@front/components/helpers/useErrorNotification';

export const useUserLogout = () => {
    const queryClient = getQueryClient();
    const dispatch = useAppDispatch();

    return useMutation(
        {
            mutationFn: logoutUser,
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
