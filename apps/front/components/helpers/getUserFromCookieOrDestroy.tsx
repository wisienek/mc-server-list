import {logout} from '@lib/front/components/store/authSlice';
import {useAppDispatch} from '@lib/front/components/store/store';
import {useCookies} from 'next-client-cookies';
import {useCallback} from 'react';
import axios from 'axios';
import {CookieNames} from '@shared/enums';
import {UserDto} from '@shared/dto';
import {useUserLogout} from '../queries/user/userLogout';

const useUserCookie = () => {
    const cookieStore = useCookies();
    const dispatch = useAppDispatch();

    const {mutate: sendLogoutRequest} = useUserLogout();

    const sessionId = cookieStore.get(CookieNames.SESSION_ID);

    const fetchUser = useCallback(async () => {
        if (!sessionId) return;

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
            console.error(`Error fetching user (${sessionId}):`, error);
            return;
        }
    }, [sessionId]);

    const fetchIsFirstLogin = useCallback(async () => {
        if (!sessionId) return;

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

    const internalLogout = useCallback(async () => {
        if (!sessionId) return;

        try {
            sendLogoutRequest();
            cookieStore.remove(CookieNames.SESSION_ID);
            dispatch(logout());

            return true;
        } catch (error) {
            console.error('Error logging out:', error);
            return false;
        }
    }, [sessionId]);

    return {fetchIsFirstLogin, fetchUser, internalLogout};
};

export default useUserCookie;
