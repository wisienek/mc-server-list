import {getQueryClient} from '@lib/front/components/atoms/getQueryClient';
import {UserDto} from '@shared/dto';
import {useQuery} from '@tanstack/react-query';
import axios from 'axios';

export const userStatusQuery = (ready: boolean) => {
    const queryClient = getQueryClient();

    return useQuery<{user: UserDto; isFirstLogin: boolean}>(
        {
            enabled: ready,
            queryKey: ['/users/status', '/users/has-credentials'],
            queryFn: async () => {
                const [userResponse, hasCredResponse] = await Promise.all([
                    axios.get<UserDto>(
                        `${process.env.NEXT_PUBLIC_API_URL}/users/status`,
                        {
                            withCredentials: true,
                        },
                    ),
                    axios.get<boolean>(
                        `${process.env.NEXT_PUBLIC_API_URL}/users/has-credentials`,
                        {
                            withCredentials: true,
                        },
                    ),
                ]);

                return {
                    user: userResponse.data,
                    isFirstLogin: hasCredResponse.data,
                };
            },
        },
        queryClient,
    );
};
