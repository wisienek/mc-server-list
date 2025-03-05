import {getQueryClient} from '@lib/front/components/atoms/getQueryClient';
import {useMutation} from '@tanstack/react-query';
import {voteForServer} from '@front/components/actions/voteForServer';

export const useVoteForServer = () => {
    const queryClient = getQueryClient();

    return useMutation<number, Error, string>(
        {
            mutationFn: voteForServer,
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
