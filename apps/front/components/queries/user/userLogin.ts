import {useMutation} from '@tanstack/react-query';
import {loginUser} from '@front/components/actions/loginUser';
import {addNotification} from '@lib/front/components/store/notificationsSlice';
import {getQueryClient} from '@lib/front/components/atoms/getQueryClient';
import {useAppDispatch} from '@lib/front/components/store/store';
import {setUser} from '@lib/front/components/store/authSlice';

export const useUserLogin = () => {
    const queryClient = getQueryClient();
    const dispatch = useAppDispatch();

    return useMutation({
        mutationFn: loginUser,
        onSuccess: (data) => {
            queryClient.invalidateQueries({queryKey: ['/servers'], exact: false});
            queryClient.invalidateQueries({
                queryKey: ['/users/status', '/users/has-credentials'],
                exact: false,
            });

            dispatch(setUser(data));
        },
        onError: (error: Error) => {
            dispatch(
                addNotification({
                    id: error.stack || Date.now().toString(),
                    level: 'Error',
                    title: error.name || 'Error',
                    description: error.message || 'An error occurred',
                }),
            );
        },
    });
};
