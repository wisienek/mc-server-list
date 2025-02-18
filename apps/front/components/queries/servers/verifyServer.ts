import {getQueryClient} from '@lib/front/components/atoms/getQueryClient';
import {useMutation} from '@tanstack/react-query';
import axios from 'axios';
import {ServerSummaryDto, VerifyServerDto} from '@shared/dto';

export const useVerifyServer = () => {
    const queryClient = getQueryClient();

    return useMutation<ServerSummaryDto, Error, ServerSummaryDto>(
        {
            mutationFn: async (server: ServerSummaryDto) => {
                const endpoint = `${process.env.NEXT_PUBLIC_API_URL}/servers/${server.host}/verify`;

                const payload: VerifyServerDto = {
                    ...(server.ip_address
                        ? {ip: server.ip_address}
                        : {hostname: server.host}),
                    port: server.port,
                    type: server.type,
                };
                const response = await axios.patch<ServerSummaryDto>(
                    endpoint,
                    payload,
                    {
                        withCredentials: true,
                    },
                );
                return response.data;
            },
            onSuccess: (_, input) => {
                queryClient.invalidateQueries({
                    queryKey: ['/servers'],
                    exact: false,
                });
                queryClient.invalidateQueries({
                    queryKey: ['/servers', input],
                    exact: true,
                });
            },
        },
        queryClient,
    );
};
