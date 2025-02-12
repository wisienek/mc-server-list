'use client';
import {setIsFirstLogin, setUser} from '@lib/front/components/store/authSlice';
import {useAppDispatch} from '@lib/front/components/store/store';
import {useCookies} from 'next-client-cookies';
import {styled} from '@mui/material/styles';
import {useEffect, useState} from 'react';
import {userStatusQuery} from '@front/components/queries/user/userStatusQuery';
import parseCookieString from '@front/components/helpers/parseCookieString';
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

    const {data, isLoading, error} = userStatusQuery(cookieReady);

    useEffect(() => {
        if (data) {
            dispatch(setUser(data.user));
            dispatch(setIsFirstLogin(data.isFirstLogin));

            const channel = new BroadcastChannel(BroadcastingChannels.logged_in);
            channel.postMessage({user: data.user, isFirstLogin: data.isFirstLogin});
        }
    }, [data, dispatch]);

    useEffect(() => {
        if (data && !isLoading) {
            const timeoutId = setTimeout(() => window.close(), 1_500);
            return () => clearTimeout(timeoutId);
        }
    }, [data, isLoading]);

    if (error) {
        console.error(error);
    }

    return (
        <StyledAuthContainer>
            <DiscordLogo rotate={isLoading} />
        </StyledAuthContainer>
    );
};

export default Page;
