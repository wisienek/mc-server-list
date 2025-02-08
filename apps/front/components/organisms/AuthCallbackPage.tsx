'use client';
import {useCookies} from 'next-client-cookies';
import {styled} from '@mui/material/styles';
import {useEffect, useState} from 'react';
import axios from 'axios';
import parseCookieString from '../helpers/parseCookieString';
import {setIsFirstLogin, setUser} from '../store/authSlice';
import DiscordLogo from '../atoms/DiscordSpinningLogo';
import {BroadcastingChannels} from '../../consts';
import {useAppDispatch} from '../store/store';
import {UserDto} from '@shared/dto';

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
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [user, setFetchedUser] = useState<UserDto>(null);
    const cookieStore = useCookies();

    useEffect(() => {
        if (!cookieString || !dispatch) {
            return;
        }

        const parsedCookieJSON = parseCookieString(cookieString);
        const decodedValue = decodeURIComponent(parsedCookieJSON.value);
        cookieStore.set(parsedCookieJSON.name, decodedValue, {
            expires: parsedCookieJSON.expires,
        });

        let userDto: UserDto;

        axios
            .get(`${process.env.NEXT_PUBLIC_API_URL}/users/status`, {
                withCredentials: true,
            })
            .then((response) => {
                userDto = response.data;
                setFetchedUser(userDto);
                dispatch(setUser(userDto));
            })
            .then(() => {
                return axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}/users/has-credentials`,
                    {
                        withCredentials: true,
                    },
                );
            })
            .then((response) => {
                const isFirstLogin: boolean = response.data;
                dispatch(setIsFirstLogin(isFirstLogin));

                const channel = new BroadcastChannel(BroadcastingChannels.logged_in);
                channel.postMessage({user: userDto, isFirstLogin});
            })
            .catch((err) => console.error(err))
            .finally(() => setIsLoading(false));
    }, [cookieString, dispatch]);

    useEffect(() => {
        if (user && !isLoading) {
            const timeoutId = setTimeout(() => window.close(), 1_500);

            return () => clearTimeout(timeoutId);
        }
    }, [user, isLoading]);

    return (
        <StyledAuthContainer>
            <DiscordLogo rotate={isLoading} />
        </StyledAuthContainer>
    );
};

export default Page;
