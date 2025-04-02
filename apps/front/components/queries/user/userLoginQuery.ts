import {parseResult} from '@core';
import {getQueryClient} from '@lib/front/components/atoms/getQueryClient';
import {UserDto} from '@shared/dto';
import {CookieNames} from '@shared/enums';
import {useQuery} from '@tanstack/react-query';
import {getUserData} from '@front/components/actions/getUserData';
import {useCookies} from 'next-client-cookies';

export const useUserQuery = (enabled = false) => {
    const queryClient = getQueryClient();
    const cookieStore = useCookies();

    return useQuery<UserDto>(
        {
            retry: 3,
            enabled,
            queryKey: ['/users/status'],
            queryFn: async () => {
                const result = parseResult(
                    await getUserData(cookieStore.get(CookieNames.SESSION_ID)),
                );

                if (result.isErr()) {
                    throw result.unwrapErr();
                }

                if (!result.unwrap()) {
                    throw `No user!`;
                }

                return result.unwrap();
            },
        },
        queryClient,
    );
};
