import {useCookies} from 'next-client-cookies';
import {useCallback} from 'react';
import axios from 'axios';
import {CookieNames} from '@shared/enums';
import {UserDto} from '@shared/dto';

const useUserCookie = () => {
    const cookieStore = useCookies();

    const sessionId = cookieStore.get(CookieNames.SESSION_ID);

    const fetchUser = useCallback(async () => {
        try {
            const statusResponse = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/users/status`,
                {
                    withCredentials: true,
                },
            );
            if (statusResponse.status.toString().startsWith('4')) {
                return;
            }
            const userDto: UserDto = statusResponse.data;
            return userDto;
        } catch (error) {
            console.error('Error fetching user:', error);
            return;
        }
    }, [sessionId]);

    const fetchIsFirstLogin = useCallback(async () => {
        try {
            const {data} = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/users/has-credentials`,
                {
                    withCredentials: true,
                },
            );
            return data || false;
        } catch (error) {
            console.error('Error fetching isFirstLogin status:', error);
            return false;
        }
    }, [sessionId]);

    return {fetchIsFirstLogin, fetchUser};
};

export default useUserCookie;
