import {getQueryClient} from '@lib/front/components/atoms/getQueryClient';
import {useMutation} from '@tanstack/react-query';
import axios from 'axios';

export const useVoteForServer = () => {
    const queryClient = getQueryClient();

    return useMutation<number, Error, string>(
        {
            mutationFn: async (hostName) => {
                const endpoint = `${process.env.NEXT_PUBLIC_API_URL}/servers/${hostName}/vote`;

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
            },
        },
        queryClient,
    );
};
