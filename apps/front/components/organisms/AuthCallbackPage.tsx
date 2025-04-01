'use client';
import {setIsFirstLogin, setUser} from '@lib/front/components/store/authSlice';
import {useAppDispatch} from '@lib/front/components/store/store';
import {useCookies} from 'next-client-cookies';
import {styled} from '@mui/material/styles';
import {useEffect, useState} from 'react';
import {useFirstLoginQuery} from '../queries/user/useFirstLoginQuery';
import parseCookieString from '@front/components/helpers/parseCookieString';
import DiscordLogo from '@front/components/atoms/DiscordSpinningLogo';
import {BroadcastingChannels} from '@front/consts';
import {useUserQuery} from '../queries/user/userLoginQuery';

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

    useEffect(() => {
        if (cookieString) {
            const parsedCookieJSON = parseCookieString(cookieString);
            const decodedValue = decodeURIComponent(parsedCookieJSON.value);
            cookieStore.set(parsedCookieJSON.name, decodedValue, {
                expires: parsedCookieJSON.expires,
            });
            setCookieReady(true);
        }
    }, [cookieString, cookieStore]);

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

    useEffect(() => {
        if (user) {
            dispatch(setUser(user));

            const channel = new BroadcastChannel(BroadcastingChannels.logged_in);
            channel.postMessage({user});
        }
    }, [user, dispatch]);

    useEffect(() => {
        if (isFirstLogin !== undefined) {
            dispatch(setIsFirstLogin(isFirstLogin));

            const channel = new BroadcastChannel(BroadcastingChannels.logged_in);
            channel.postMessage({isFirstLogin});
        }
    }, [isFirstLogin, dispatch]);

    useEffect(() => {
        if (
            user &&
            isFirstLogin !== undefined &&
            !isLoadingUser &&
            !isFirstLoginLoading
        ) {
            const timeoutId = setTimeout(() => window.close(), 1_500);
            return () => clearTimeout(timeoutId);
        }
    }, [user, isFirstLogin, isLoadingUser, isFirstLoginLoading]);

    if (isFirstLoginError || isErrorUser) {
        console.error({isFirstLoginError, isErrorUser});
    }

    return (
        <StyledAuthContainer>
            <DiscordLogo rotate={isLoadingUser || isFirstLoginLoading} />
        </StyledAuthContainer>
    );
};

export default Page;
