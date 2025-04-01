import {parseResult} from '@core';
import {getQueryClient} from '@lib/front/components/atoms/getQueryClient';
import {useMutation} from '@tanstack/react-query';
import {voteForServer} from '@front/components/actions/voteForServer';
import {useErrorNotification} from '../../helpers/useErrorNotification';

export const useVoteForServer = () => {
    const queryClient = getQueryClient();

    return useMutation<number, Error, string>(
        {
            mutationFn: async (data) => {
                const result = parseResult(await voteForServer(data));
                if (result.isErr()) {
                    throw result.unwrapErr();
                }
                return result.unwrap();
            },
            onError: useErrorNotification(),
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
