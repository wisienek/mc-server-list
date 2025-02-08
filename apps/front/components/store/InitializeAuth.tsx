'use client';
import {UserDto} from '@shared/dto';
import {useRouter} from 'next/navigation';
import React, {useEffect} from 'react';
import {BroadcastingChannels} from '../../consts';
import useUserCookie from '../helpers/getUserFromCookieOrDestroy';
import {setIsFirstLogin, setUser} from './authSlice';
import {useAppDispatch} from './store';

const InitializeAuth: React.FC = () => {
    const dispatch = useAppDispatch();
    const {fetchUser, fetchIsFirstLogin} = useUserCookie();
    const router = useRouter();

    useEffect(() => {
        const init = async () => {
            const userDto = await fetchUser();
            if (userDto) {
                dispatch(setUser(userDto));

                const isFirstLogin = await fetchIsFirstLogin();
                dispatch(setIsFirstLogin(isFirstLogin));
            }
        };

        init();
    }, [dispatch, fetchUser, fetchIsFirstLogin]);

    useEffect(() => {
        const channel = new BroadcastChannel(BroadcastingChannels.logged_in);

        channel.onmessage = (
            event: MessageEvent<{user: UserDto; isFirstLogin: boolean}>,
        ) => {
            const {user, isFirstLogin} = event.data;
            if (user) {
                dispatch(setUser(user));
            }

            if (isFirstLogin !== undefined) {
                dispatch(setIsFirstLogin(isFirstLogin));
                router.push(`/en/set-password`);
            }
        };

        return () => channel.close();
    }, [dispatch]);

    return <></>;
};

export default InitializeAuth;
