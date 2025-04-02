'use client';
import {setIsFirstLogin, setUser} from '@lib/front/components/store/authSlice';
import {useAppDispatch} from '@lib/front/components/store/store';
import {useCookies} from 'next-client-cookies';
import {styled} from '@mui/material/styles';
import {useEffect, useMemo, useState} from 'react';
import {useFirstLoginQuery} from '@front/components/queries/user/useFirstLoginQuery';
import parseCookieString from '@front/components/helpers/parseCookieString';
import {useUserQuery} from '@front/components/queries/user/userLoginQuery';
import AnimatedCheckmark from '@front/components/atoms/AnimatedCheckmark';
import DiscordLogo from '@front/components/atoms/DiscordSpinningLogo';
import {BroadcastingChannels} from '@front/consts';

const StyledAuthContainer = styled('div')(() => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100vw',
    height: '100vh',
    backgroundColor: '#2C2F33',
    left: 0,
    top: 0,
    overflow: 'hidden',
    position: 'absolute',
}));

type PageProps = {
    cookieString: string;
};

const Page = ({cookieString}: PageProps) => {
    const dispatch = useAppDispatch();
    const cookieStore = useCookies();

    const [cookieReady, setCookieReady] = useState<boolean>(false);

    const {
        data: isFirstLogin,
        isLoading: isFirstLoginLoading,
        error: isFirstLoginError,
    } = useFirstLoginQuery(cookieReady);
    const {
        data: user,
        isLoading: isLoadingUser,
        error: isErrorUser,
    } = useUserQuery(cookieReady);

    const credentialsReady = isFirstLogin !== undefined && !!user;

    useEffect(() => {
        if (cookieString) {
            const parsedCookieJSON = parseCookieString(cookieString);
            const decodedValue = decodeURIComponent(parsedCookieJSON.value);
            cookieStore.set(parsedCookieJSON.name, decodedValue, {
                expires: parsedCookieJSON.expires,
            });

            const timeout = setTimeout(() => setCookieReady(true), 200);
            return () => clearTimeout(timeout);
        }
    }, [cookieString, cookieStore]);

    useEffect(() => {
        if (user) {
            dispatch(setUser(user));

            const channel = new BroadcastChannel(BroadcastingChannels.logged_in);
            channel.postMessage({user});
            channel.close();
        }
    }, [user, dispatch]);

    useEffect(() => {
        if (isFirstLogin !== undefined) {
            dispatch(setIsFirstLogin(isFirstLogin));

            const channel = new BroadcastChannel(BroadcastingChannels.logged_in);
            channel.postMessage({isFirstLogin});
            channel.close();
        }
    }, [isFirstLogin, dispatch]);

    useEffect(() => {
        if (credentialsReady && !isLoadingUser && !isFirstLoginLoading) {
            const timeoutId = setTimeout(() => window.close(), 1_500);
            return () => clearTimeout(timeoutId);
        }
    }, [user, isFirstLogin, isLoadingUser, isFirstLoginLoading]);

    if (isFirstLoginError || isErrorUser) {
        console.error({isFirstLoginError, isErrorUser});
    }

    const CurrentIcon = useMemo(() => {
        if (credentialsReady) {
            return <AnimatedCheckmark />;
        }

        return (
            <DiscordLogo
                rotate={!credentialsReady || isLoadingUser || isFirstLoginLoading}
            />
        );
    }, [credentialsReady, isLoadingUser, isFirstLoginLoading]);

    return <StyledAuthContainer>{CurrentIcon}</StyledAuthContainer>;
};

export default Page;
