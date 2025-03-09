'use client';
import {useCookies} from 'next-client-cookies';
import {type FC, useEffect, useCallback, useMemo} from 'react';
import {useRouter} from 'next/navigation';
import {userStatusQuery} from '@front/components/queries/user/userStatusQuery';
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
    const {data, refetch, isFetching} = userStatusQuery(
        Boolean(!user || isFirstLogin === undefined),
    );

    const locale = useMemo(() => {
        return cookieStore.get('NEXT_LOCALE') ?? routing.defaultLocale;
    }, [cookieStore]);

    const initializeUser = useCallback(async () => {
        if (isFetching) {
            return;
        }

        const userFetchResponse = data ?? (await refetch()).data;
        if (userFetchResponse) {
            dispatch(setUser(userFetchResponse.user));
            dispatch(setIsFirstLogin(userFetchResponse.isFirstLogin));
        }
    }, [data, refetch, dispatch, isFetching]);

    useEffect(() => {
        if (!user || isFirstLogin === undefined) {
            initializeUser();
        } else {
            dispatch(setUser(user));
            dispatch(setIsFirstLogin(isFirstLogin));
        }
    }, [user, isFirstLogin, initializeUser, dispatch]);

    useEffect(() => {
        const channel = new BroadcastChannel(BroadcastingChannels.logged_in);
        channel.onmessage = ({
            data,
        }: MessageEvent<{user: UserDto; isFirstLogin: boolean}>) => {
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
    }, [dispatch, router]);

    return null;
};

export default InitializeAuth;
