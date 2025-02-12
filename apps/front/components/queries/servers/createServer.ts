import {getQueryClient} from '@lib/front/components/atoms/getQueryClient';
import {useMutation} from '@tanstack/react-query';
import axios from 'axios';
import {CreateServerDto, CreateServerResponseDto} from '@shared/dto';

export const useCreateServer = () => {
    const queryClient = getQueryClient();

    return useMutation<CreateServerResponseDto, Error, CreateServerDto>(
        {
            mutationFn: async (data) => {
                const endpoint = `${process.env.NEXT_PUBLIC_API_URL}/servers`;

                const response = await axios.post<CreateServerResponseDto>(
                    endpoint,
                    data,
                    {
                        withCredentials: true,
                    },
                );

                return response.data;
            },
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: ['/servers'],
                    exact: false,
                    refetchType: 'all',
                });
            },
        },
        queryClient,
    );
};
