import {parseResult} from '@core';
import {getQueryClient} from '@lib/front/components/atoms/getQueryClient';
import {useQuery} from '@tanstack/react-query';
import {getUserSetCredentials} from '@front/components/actions/getUserSetCredentials';

export const useFirstLoginQuery = (enabled = false, allowUnauthorized = true) => {
    const queryClient = getQueryClient();

    return useQuery<boolean>(
        {
            enabled,
            queryKey: ['/users/has-credentials'],
            staleTime: Infinity,
            queryFn: async () => {
                const result = parseResult(await getUserSetCredentials());
                if (result.isErr()) {
                    if (allowUnauthorized) {
                        return null;
                    }

                    throw result.unwrapErr();
                }

                return result.unwrap();
            },
        },
        queryClient,
    );
};
