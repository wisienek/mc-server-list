import {ServerDetailsDto} from '@shared/dto';
import axios from 'axios';
import ServerDetails from '@front/components/organisms/ServerDetailsPage';
import type {LocaleParams} from '../layout';

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
    const hosts: string[] = await axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/servers/hostnames`)
        .then((res) => res?.data);

    return (hosts ?? []).map((host) => ({
        hostname: host,
    }));
}

type HostnamePageProps = {
    params: Promise<LocaleParams & {hostname: string}>;
};

export default async function Page(props: HostnamePageProps) {
    const hostName = (await props.params).hostname;

    const serverDetails = (
        await axios.get<ServerDetailsDto>(
            `${process.env.NEXT_PUBLIC_API_URL}/servers/${hostName}`,
        )
    ).data;

    return <ServerDetails server={serverDetails} />;
}
