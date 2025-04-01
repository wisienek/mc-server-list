import {parseResult} from '@core';
import {getQueryClient} from '@lib/front/components/atoms/getQueryClient';
import {UserDto} from '@shared/dto';
import {useQuery} from '@tanstack/react-query';
import {getUserData} from '@front/components/actions/getUserData';

export const useUserQuery = (enabled = false, allowUnauthorized = true) => {
    const queryClient = getQueryClient();

    return useQuery<UserDto>(
        {
            enabled,
            queryKey: ['/users/status'],
            queryFn: async () => {
                const result = parseResult(await getUserData());
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
