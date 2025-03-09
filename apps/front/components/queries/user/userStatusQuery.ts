import {getQueryClient} from '@lib/front/components/atoms/getQueryClient';
import {UserDto} from '@shared/dto';
import {useQuery} from '@tanstack/react-query';
import {getUserSetCredentials} from '@front/components/actions/getUserSetCredentials';
import {getUserData} from '@front/components/actions/getUserData';

export const userStatusQuery = (enabled = false) => {
    const queryClient = getQueryClient();

    return useQuery<{user: UserDto; isFirstLogin: boolean}>(
        {
            enabled,
            queryKey: ['/users/status', '/users/has-credentials'],
            queryFn: async () => {
                const [userResponse, hasCredResponse] = await Promise.all([
                    getUserData(),
                    getUserSetCredentials(),
                ]);

                return {
                    user: userResponse,
                    isFirstLogin: hasCredResponse,
                };
            },
        },
        queryClient,
    );
};
