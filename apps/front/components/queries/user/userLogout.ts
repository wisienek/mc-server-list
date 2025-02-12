import {getQueryClient} from '@lib/front/components/atoms/getQueryClient';
import {useMutation} from '@tanstack/react-query';
import axios from 'axios';

export const useUserLogout = () => {
    const queryClient = getQueryClient();

    return useMutation(
        {
            mutationFn: async () => {
                const endpoint = `${process.env.NEXT_PUBLIC_API_URL}/users/logout`;

                const response = await axios.post<number>(endpoint, null, {
                    withCredentials: true,
                });

                return response.data;
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
            },
        },
        queryClient,
    );
};
