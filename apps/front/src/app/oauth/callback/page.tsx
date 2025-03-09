import {notFound} from 'next/navigation';
import AuthCallbackPage from '@front/components/organisms/AuthCallbackPage';
import {discordLogin} from '@front/components/actions/discordLogin';

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

    const sessionCookie = await discordLogin(Array.isArray(code) ? code[0] : code);

    return <AuthCallbackPage cookieString={sessionCookie} />;
};

export default Page;
