import {parseResult} from '@core';
import {getQueryClient} from '@lib/front/components/atoms/getQueryClient';
import {useMutation} from '@tanstack/react-query';
import {ServerSummaryDto} from '@shared/dto';
import {verifyServer} from '@front/components/actions/verifyServer';
import {useErrorNotification} from '@front/components/helpers/useErrorNotification';

export const useVerifyServer = () => {
    const queryClient = getQueryClient();

    return useMutation<ServerSummaryDto, Error, ServerSummaryDto>(
        {
            mutationFn: async (data) => {
                const result = parseResult(await verifyServer(data));
                if (result.isErr()) {
                    throw result.unwrapErr();
                }
                return result.unwrap();
            },
            onError: useErrorNotification(),
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
