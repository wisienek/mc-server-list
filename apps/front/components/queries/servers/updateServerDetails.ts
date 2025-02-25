import {getQueryClient} from '@lib/front/components/atoms/getQueryClient';
import {ServerDetailsDto, UpdateServerDetailsDto} from '@shared/dto';
import {useMutation} from '@tanstack/react-query';
import axios from 'axios';

export const updateServerDetails = (hostName: string) => {
    const queryClient = getQueryClient();

    return useMutation<ServerDetailsDto, Error, UpdateServerDetailsDto>(
        {
            mutationFn: async (details) => {
                const endpoint = `${process.env.NEXT_PUBLIC_API_URL}/servers/${hostName}/details`;

                const response = await axios.patch<ServerDetailsDto>(
                    endpoint,
                    details,
                    {
                        withCredentials: true,
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    },
                );

                return response.data;
            },
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: [`/servers/${hostName}`],
                    exact: true,
                });
            },
        },
        queryClient,
    );
};
