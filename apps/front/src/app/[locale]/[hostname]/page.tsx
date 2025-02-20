import ServerDetails from '@front/components/organisms/ServerDetailsPage';
import {getHostnames} from '@front/components/actions/getHostnames';
import {getServerDetails} from '@front/components/actions/getServerDetails';
import type {LocaleParams} from '../layout';

export const revalidate = 3_600;
export const dynamicParams = true;

export async function generateStaticParams() {
    const hosts = await getHostnames();
    return (hosts ?? []).map((host) => ({
        hostname: host,
    }));
}

type HostnamePageProps = {
    params: Promise<LocaleParams & {hostname: string}>;
};

export default async function Page(props: HostnamePageProps) {
    const hostName = (await props.params).hostname;
    const serverDetails = await getServerDetails(hostName);

    return <ServerDetails server={serverDetails} />;
}
