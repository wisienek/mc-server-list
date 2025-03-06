import {CookieNames} from '@shared/enums';
import {notFound} from 'next/navigation';
import AuthCallbackPage from '@front/components/organisms/AuthCallbackPage';

type PageProps = {
    searchParams: Promise<{
        [key: string]: string | string[] | undefined;
    }>;
};

const Page = async ({searchParams}: PageProps) => {
    const params = await searchParams;
    const code = params['code'];

    if (!code) {
        notFound();
    }

    const fetchResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/login?code=${code}`,
        {credentials: 'include'},
    );
    const extractedCookie = fetchResponse.headers
        .getSetCookie()
        .find((i) => i.includes(CookieNames.SESSION_ID));

    return <AuthCallbackPage cookieString={extractedCookie} />;
};

export default Page;
