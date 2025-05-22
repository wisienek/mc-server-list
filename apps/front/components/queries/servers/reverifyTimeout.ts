import {parseResult} from '@core';
import {getQueryClient} from '@lib/front/components/atoms/getQueryClient';
import {useMutation} from '@tanstack/react-query';
import {useErrorNotification} from '@front/components/helpers/useErrorNotification';
import {reVerifyTimedOutServer} from '@front/components/actions/reVerifyTimedoutServer';
import {ServerSummaryDto} from '@shared/dto';

export const useReVerifyTimeout = () => {
    const queryClient = getQueryClient();

    return useMutation<ServerSummaryDto, Error, string>(
        {
            mutationFn: async (hostName) => {
                const result = parseResult(await reVerifyTimedOutServer(hostName));
                if (result.isErr()) {
                    throw result.unwrapErr();
                }
                return result.unwrap();
            },
            onError: useErrorNotification(),
            onSuccess: (_, hostName) => {
                queryClient.invalidateQueries({
                    queryKey: ['/servers'],
                    exact: false,
                });
                queryClient.invalidateQueries({
                    queryKey: [`/servers/${hostName}`],
                    exact: true,
                });
            },
        },
        queryClient,
    );
};
