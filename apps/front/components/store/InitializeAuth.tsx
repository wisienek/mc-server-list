'use client';
import {useRouter} from 'next/navigation';
import React, {useEffect} from 'react';
import useUserCookie from '@front/components/helpers/getUserFromCookieOrDestroy';
import {setIsFirstLogin, setUser} from '@lib/front/components/store/authSlice';
import {useAppDispatch} from '@lib/front/components/store/store';
import {BroadcastingChannels} from '@front/consts';
import {UserDto} from '@shared/dto';

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
