'use client';
import axios from 'axios';
import {unauthorized} from 'next/navigation';
import {useEffect} from 'react';
import parseCookieString from '../helpers/parseCookieString';
import {useCookies} from 'next-client-cookies';

type PageProps = {
    cookieString: string;
};

const Page = ({cookieString}: PageProps) => {
    const cookieStore = useCookies();
    if (!cookieString) {
        unauthorized();
    }

    useEffect(() => {
        const parsedCookieJSON = parseCookieString(cookieString);
        const decodedValue = decodeURIComponent(parsedCookieJSON.value);
        cookieStore.set(parsedCookieJSON.name, decodedValue, {
            expires: parsedCookieJSON.expires,
        });

        axios
            .get(`${process.env.NEXT_PUBLIC_API_URL}/users/status`, {
                withCredentials: true,
            })
            .then((data) => console.log(data))
            .catch((err) => console.error(err));
    }, []);

    return (
        <html>
            <body>
                <p>Logging in...</p>
            </body>
        </html>
    );
};

export default Page;
