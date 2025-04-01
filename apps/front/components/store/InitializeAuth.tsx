'use client';

import {useCookies} from 'next-client-cookies';
import {type FC, useEffect, useCallback, useMemo, useRef} from 'react';
import {useRouter} from 'next/navigation';
import {useFirstLoginQuery} from '../queries/user/useFirstLoginQuery';
import {useUserQuery} from '../queries/user/userLoginQuery';
import {setIsFirstLogin, setUser} from '@lib/front/components/store/authSlice';
import {useAppDispatch} from '@lib/front/components/store/store';
import {BroadcastingChannels} from '@front/consts';
import {routing} from '@front/i18n/routing';
import {UserDto} from '@shared/dto';

export type InitializeAuthProps = {
    user?: UserDto;
    isFirstLogin?: boolean;
};

const InitializeAuth: FC<InitializeAuthProps> = ({user, isFirstLogin}) => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const cookieStore = useCookies();

    const initialized = useRef(false);

    const shouldFetch = useMemo(
        () => !user || isFirstLogin === undefined,
        [user, isFirstLogin],
    );

    const {
        data: userData,
        refetch: refetchUser,
        isFetching: isUserFetching,
    } = useUserQuery(shouldFetch && !initialized.current);

    const {
        data: firstLoginData,
        refetch: refetchFirstLogin,
        isFetching: isFirstLoginFetching,
    } = useFirstLoginQuery(shouldFetch && !initialized.current);

    const locale = useMemo(() => {
        return cookieStore.get('NEXT_LOCALE') ?? routing.defaultLocale;
    }, [cookieStore]);

    const initializeUserData = useCallback(async () => {
        if (isUserFetching) return;
        const userRes = userData ?? (await refetchUser()).data;
        if (userRes) dispatch(setUser(userRes));
    }, [userData, refetchUser, isUserFetching, dispatch]);

    const initializeFirstLogin = useCallback(async () => {
        if (isFirstLoginFetching) return;
        const firstLoginRes = firstLoginData ?? (await refetchFirstLogin()).data;
        if (firstLoginRes !== undefined) dispatch(setIsFirstLogin(firstLoginRes));
    }, [firstLoginData, refetchFirstLogin, isFirstLoginFetching, dispatch]);

    useEffect(() => {
        if (!user || isFirstLogin === undefined) {
            if (!initialized.current) {
                initialized.current = true;
                initializeUserData();
                initializeFirstLogin();
            }
        } else {
            initialized.current = true;
            dispatch(setUser(user));
            dispatch(setIsFirstLogin(isFirstLogin));
        }
    }, [user, isFirstLogin, initializeUserData, initializeFirstLogin, dispatch]);

    useEffect(() => {
        const channel = new BroadcastChannel(BroadcastingChannels.logged_in);
        channel.onmessage = ({
            data,
        }: MessageEvent<{user?: UserDto; isFirstLogin?: boolean}>) => {
            if (data.user) {
                dispatch(setUser(data.user));
            }

            if (data.isFirstLogin !== undefined) {
                dispatch(setIsFirstLogin(data.isFirstLogin));

                if (data.isFirstLogin === true) {
                    router.push(`/${locale}/set-password`);
                }
            }
        };

        return () => channel.close();
    }, [dispatch, router, locale]);

    return null;
};

export default InitializeAuth;
