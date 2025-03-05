import {getQueryClient} from '@lib/front/components/atoms/getQueryClient';
import {useMutation} from '@tanstack/react-query';
import {ServerSummaryDto} from '@shared/dto';
import {verifyServer} from '../../actions/verifyServer';

export const useVerifyServer = () => {
    const queryClient = getQueryClient();

    return useMutation<ServerSummaryDto, Error, ServerSummaryDto>(
        {
            mutationFn: verifyServer,
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
